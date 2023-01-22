# GitHub Action: Compile Sourcepawn Plugin

Compile sourcepawn plugins by using the latest sourcemod build of a selected version

## Inputs

### input

**Description**: `path/to/plugin.sp` The path to your plugin file.<br />
**Required**: `true`<br />

### output

**Description**: `path/to/plugin.smx` The path to output your compiled plugin file.<br />
**Required**: `true`<br />
**NOTE**: This action will attempt to create the directory if the folder does not exists.<br />

### sourcemod

**Description**: Sourcemod version. It must be `1.7`, `1.8`, `1.9`, `1.10`, `1.11` or `1.12`<br />
**Required**: `true`<br />
**Default**: `1.12`<br />

### includes

**Description**: `path/to/include`. If your plugin has custom includes, you can target it's path here.<br />
**Required**: `false`<br />

### comp64

**Description**: If true, it will try to use spcomp64, otherwise it will use normal spcomp<br />
**Required**: `false`<br />
**Default**: `true`<br />

## Example

### Simple use

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v1
  with:
    sourcemod: '1.12' # It will use the latest Sourcemod 1.12 Build
    input: 'addons/sourcemod/scripting/myplugin.sp' # the <file>.sp is located at <repo_root>/sourcemod/scripting/myplugin.sp
    output: 'myplugin.smx' # outputs at <repo_root>
```

### Passing an include path

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v1
  with:
    sourcemod: '1.11'
    input: 'scripting/myplugin.sp'
    output: 'plugins/myplugin.smx'
    include: 'scripting/include'
```

### Passing more than one include

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v1
  with:
    input: 'my_plugin/scripting/myplugin.sp'
    output: 'my_plugin/plugins/myplugin.smx'
    include: 'my_plugin/scripting/include my_other_plugin/scripting/include'
```

### Using 32-bits compiler

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v1
  with:
    input: 'scripting/myplugin.sp'
    output: 'plugins/myplugin.smx'
    comp64: 'false'
```
