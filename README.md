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

```yml
- name: Compile My plugin
  uses: SheplyRam/compile-sourcemod-plugin@v2
  with:
    sourcemod: '1.12'
    input: 'addons/sourcemod/scripting/myplugin.sp'
    output: 'myplugin.smx'
```
