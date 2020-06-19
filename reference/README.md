# Additional Files

## append.js
Takes in a folder of individual JSON files numbered and titled by frame and outputs a single file containing all of them in a list.

The command line argument should be the name of the directory (e.g. no file ending) - The output file uses the same name.

```bash
$ node append.js Balance001
```

## converter.js
Takes in an OpenPose file and converts it to a PoseNet file. It presently only implements single pose estimation, but would be easy to update in future cases with multiple bodies...

The command line argument should be the name of the OpenPose file. The output file name adds `_converted` to its title.

```bash
$ node converter.js Balance001.json
```
