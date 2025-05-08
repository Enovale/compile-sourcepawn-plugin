import fs from 'fs/promises'
import { join as pathJoin } from 'path'

import { info, addPath, getInput, setFailed, setOutput } from '@actions/core'
import { exec } from '@actions/exec'
import { HttpClient } from '@actions/http-client'
import { downloadTool, extractTar, extractZip } from '@actions/tool-cache'

type FileExtractor = typeof extractTar | typeof extractZip

type SupportedOS = 'mac' | 'linux' | 'windows'
type SupportedPlatforms = 'darwin' | 'linux' | 'win32'

function getOS(platform = process.platform): SupportedOS {
	const platforms: Record<SupportedPlatforms, SupportedOS> = {
		darwin: 'mac',
		linux: 'linux',
		win32: 'windows',
	}

	if (!Object.keys(platforms).includes(platform)) {
		throw new Error(`unsupported platform "${platform}"`)
	}

	return platforms[process.platform as SupportedPlatforms]
}

function getSourcemodVersion(): string {
	const smVersions = ['1.7', '1.8', '1.9', '1.10', '1.11', '1.12']

	const smVersion = getInput('sourcemod')

	if (!smVersions.includes(smVersion)) {
		throw new TypeError(`Unsupported Sourcemod version: ${smVersion}`)
	}

	return smVersion
}

async function ensureOutputDir(output: string): Promise<void> {
	output = output
		.split('/')
		.filter(dir => !dir.endsWith('.smx'))
		.join('/')

	await fs.mkdir(output, { recursive: true })
}

async function execCommand(...commandParts: string[]): Promise<void> {
	const command = commandParts.filter(Boolean).join(' ')

	const exitCode = await exec(command)

	if (exitCode !== 0) {
		throw new Error(`command exited with ${exitCode}`)
	}
}

async function extractFile(file: string): Promise<string> {
	const extractors: Record<SupportedOS, FileExtractor> = {
		linux: extractTar,
		mac: extractZip,
		windows: extractZip,
	}

	const extractor = extractors[getOS()]

	return await extractor(file)
}

async function installCompiler(smVersion: string): Promise<string> {
	const fetcher = new HttpClient('smdrop')

	const platformURI = `sourcemod-latest-${getOS()}`

	try {
		const smFileName = await (
			await fetcher.get(
				`https://sm.alliedmods.net/smdrop/${smVersion}/${platformURI}`,
			)
		).readBody()

		const smFile = await downloadTool(
			`https://sm.alliedmods.net/smdrop/${smVersion}/${smFileName}`,
		)

		const sourcemod = await extractFile(smFile)

		addPath(pathJoin(sourcemod, 'addons', 'sourcemod', 'scripting'))

		info(pathJoin(sourcemod, 'addons', 'sourcemod', 'scripting'))
		info(smFile)

		return pathJoin(sourcemod, 'addons', 'sourcemod')
	} catch (e) {
		throw new Error(
			`Couldn't fetch ${getOS()} version of Sourcemod ${smVersion}`,
		)
	}
}

function use64Comp(): boolean {
	const supported64Archs = ['arm64', 'ppc64', 's390x', 'x64']

	let useComp64 = getInput('comp64')

	if (useComp64.length === 0) useComp64 = 'true'

	if (!['true', 'false'].includes(useComp64)) {
		throw new Error(`Unsupported argument for comp64: "${useComp64}"`)
	}

	return supported64Archs.includes(process.arch) && useComp64 === 'true'
}

async function run(): Promise<void> {
	const input = getInput('input', { required: true })
	const output = getInput('output', { required: true })

	const includes = getInput('includes')
		.split(/\s/g)
		.filter(Boolean)
		.map(includePath => `-i ${includePath}`)
		.join(' ')

	try {
		const smVersion = getSourcemodVersion()

		const sourcemodPath = await installCompiler(smVersion)

		const sourcemodIncludes = pathJoin(sourcemodPath, 'scripting', 'include')

		await ensureOutputDir(output)

		await execCommand(
			pathJoin(sourcemodPath, 'scripting', use64Comp() ? 'spcomp64' : 'spcomp'),
			input,
			`-o ${output}`,
			`-i ${sourcemodIncludes}`,
			includes,
			'-O2 -v2',
		)

		setOutput('result', output)
	} catch (error) {
		setFailed(`Action failed: ${(error as Error).message}`)
	}
}

void run()
