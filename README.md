# GitHub Compile Sourcemod Plugin Action

this action compiles a given input to a given output using the latest release of the sourcemod (1.11 or 1.12, you choose).

## Inputs

### input

**Description**: `path/to/plugin.sp` The path to your plugin file.
**Required**: `true`

### output

**Description**: `path/to/plugin.smx` The path to output your compiled plugin file.
**Required**: `true`

### sourcemod

**Description**: Sourcemod version. It must bem `1.11` or `1.12`
**Required**: `true`
**Default**: `1.12`

### includes

**Description**: `path/to/include`. If your plugin has custom includes, you can target it's path here.
**Required**: `false`


## Example

### Simple use

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v2
  with:
    sourcemod: '1.12' # Uses the latest Sourcemod 1.12 Build
    input: 'addons/sourcemod/scripting/myplugin.sp' # the file is located at <repo_root>/sourcemod/scripting/myplugin.sp
    output: 'myplugin.smx' # outputs at <repo_root>
```

### Passing an include path

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v2
  with:
    sourcemod: '1.11'
    input: 'scripting/myplugin.sp'
    output: 'plugins/myplugin.smx'
    include: 'scripting/include'
```

### Passing more than one include

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v2
  with:
    input: 'my_plugin/scripting/myplugin.sp'
    output: 'my_plugin/plugins/myplugin.smx'
    include: 'my_plugin/scripting/include my_other_plugin/scripting/include'
```
