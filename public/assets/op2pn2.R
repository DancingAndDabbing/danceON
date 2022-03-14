#!/usr/bin/env Rscript
library(RJSONIO)
args <- commandArgs(trailingOnly = TRUE)

if (length(args)==0) {
  stop("At least one argument must be supplied (input file).n", call.=FALSE)
}

coco2posenet <- structure(list(keypt0 = 0:18,
                               cocopart = c("Nose", "Neck", "RShoulder",
                                            "RElbow", "RWrist", "LShoulder", "LElbow", "LWrist", "MidHip",
                                            "RHip", "RKnee", "RAnkle", "LHip", "LKnee", "LAnkle", "REye",
                                            "LEye", "REar", "LEar"),
                               posenet = c("nose", NA, "rightShoulder",
                                           "rightElbow", "rightWrist", "leftShoulder", "leftElbow", "leftWrist",
                                           NA, "rightHip", "rightKnee", "rightAnkle", "leftHip", "leftKnee",
                                           "leftAnkle", "rightEye", "leftEye", "rightEar", "leftEar")),
                          class = "data.frame",
                          row.names = c(NA, -19L))
excludeRows <- which(is.na(coco2posenet$posenet))



newOrder <- c('nose', 'leftEye', 'rightEye',
              'leftEar', 'rightEar',
              'leftShoulder', 'rightShoulder',
              'leftElbow', 'rightElbow',
              'leftWrist', 'rightWrist',
              'leftHip', 'rightHip',
              'leftKnee', 'rightKnee',
              'leftAnkle','rightAnkle')




## This is for multi-file output
getFramesFromJSON <- function(output_dir) {
  # frames will be an multi-dimensional lsit array of framenums x people x [COCO model]
  frames <- list()
  framenum <- 1
  for (jfile in grep(".json",list.files(path=output_dir), value=T)){ #need to make sure to ignore non-JSON files
    json_file <- fromJSON(file.path(output_dir,jfile)) #reading each json file, convert to R list
    # it can also happen that there are no people in the frame
    if (length(json_file$people)) {
      # We will append the frames list with a matrix of pose keypoints
      # First two columns are planar coordinates, thrid is confidence.
      pose_keypoints2d <- lapply(json_file$people, function(a){
        matrix(a$pose_keypoints_2d, ncol=3, byrow = TRUE) # DON'T throw away third column
      })
      frames[[framenum]] <- pose_keypoints2d # each frame gets a list of matrices
      framenum <- framenum+1
    }
  }
  return(frames)
}

convertCOCOmultiFile <- function(jsondir) {
  frames <- getFramesFromJSON(jsondir)
  poseNetVersion <- vector("list",length(frames))
  for (j in 1:length(frames)) {
    tmp <- frames[[j]][[1]][1:19,]
    tmp <- data.frame(tmp, row.names=coco2posenet$cocopart[1:nrow(tmp)])
    names(tmp) <- c("x","y","conf")
    tmp$pnetname <- coco2posenet$posenet[1:nrow(tmp)]
    # now keep only keypoints which are named in posenet
    tmp <- tmp[-excludeRows,]
    # and finally reorder to match Willie's code
    rownames(tmp) <- tmp$pnetname
    tmp <- tmp[newOrder,]
    # tmp[tmp==0] <- "null"
    poseNetVersion[[j]] <- vector("list",1) # this is where 1-person is hard-coded
    poseNetVersion[[j]][[1]]$pose <- list()
    poseNetVersion[[j]][[1]]$pose$keypoints <- list()
    for (i in 1:nrow(tmp)) {
      poseNetVersion[[j]][[1]]$pose[["keypoints"]][[i]] <- list(position=list(x=tmp[i,"x"],y=tmp[i,"y"]),
                                           score=tmp[i,"conf"],
                                           part=tmp[i,"pnetname"])
      poseNetVersion[[j]][[1]]$pose[[tmp[i,"pnetname"]]] <- list(x=tmp[i,"x"],
                                            y=tmp[i,"y"],
                                            confidence=tmp[i,"conf"])
    }

  }
  return(poseNetVersion)
}

####
# read into R form openpose
dir <- args[1]
poses <- convertCOCOmultiFile(dir)
str <- paste0('{"data":',toJSON(poses, collapse = ""),'}')
write(str, file=paste0(dir,".json"))
