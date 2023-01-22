import { join as pathJoin } from 'path'

import { addPath, getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { HttpClient } from '@actions/http-client'
import { downloadTool, extractTar, extractZip } from '@actions/tool-cache'

type SourcemodVersion = '1.11' | '1.12'

function isPlatformLinux(): boolean {
	return process.platform === 'linux'
}

function getSourcemodVersion(): SourcemodVersion {
	const smVersions = ['1.11', '1.12']

	const smVersion = getInput('sourcemod', {
		required: false,
	}) as SourcemodVersion

	if (!smVersions.includes(smVersion)) {
		throw new TypeError('sm_version must bem 1.11 or 1.12')
	}

	return smVersion
}

async function installCompiler(smVersion: SourcemodVersion): Promise<string> {
	const fetcher = new HttpClient('smdrop')

	const platformURI = isPlatformLinux()
		? 'sourcemod-latest-linux'
		: 'sourcemod-latest-windows'

	const smFileName = await (
		await fetcher.get(
			`https://sm.alliedmods.net/smdrop/${smVersion}/${platformURI}`,
		)
	).readBody()

	const smFile = await downloadTool(
		`https://sm.alliedmods.net/smdrop/${smVersion}/${smFileName}`,
	)

	const extractFiles = isPlatformLinux() ? extractTar : extractZip

	const sourcemod = await extractFiles(smFile)

	addPath(pathJoin(sourcemod, 'addons', 'sourcemod', 'scripting'))

	return pathJoin(sourcemod, 'addons', 'sourcemod')
}

async function execCommand(...commandParts: string[]): Promise<void> {
	const command = commandParts.filter(Boolean).join(' ')

	const exitCode = await exec(command)

	if (exitCode !== 0) {
		throw new Error(`command exited with ${exitCode}`)
	}
}

async function run(): Promise<void> {
	const input = getInput('input', { required: true })
	const output = getInput('output', { required: true })

	const includes = getInput('includes', { required: false })
		.split(/\s/g)
		.filter(Boolean)
		.map(includePath => `-i ${includePath}`)
		.join(' ')

	try {
		const smVersion = getSourcemodVersion()

		const sourcemodPath = await installCompiler(smVersion)

		const sourcemodIncludes = pathJoin(sourcemodPath, 'scripting', 'include')

		await execCommand(
			'spcomp64',
			input,
			`-o ${output}`,
			`-i ${sourcemodIncludes}`,
			includes,
			'-O2 -v2',
		)
	} catch (error) {
		setFailed(`Action failed: ${(error as Error).message}`)
	}
}

void run()
