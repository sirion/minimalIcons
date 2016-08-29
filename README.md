# minimalIcons
A set of minimal SVG Icons


## js Folder

Contains the icons.js with the IconLibrary object and the createElement function

Include the file and use `IconLibrary.create(iconName, additionalOptions)` to create an Icon:

```
var downloadIcon = IconLibrary.createIcon("download");

var redDownloadIcon = IconLibrary.createIcon("download", { stroke: "#f00" });

```

For examples see http://sirion.github.io/minimalIcons/
