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


convertCOCOdata2 <- function(jsonfile) {
  frames <- fromJSON(jsonfile)
  poseNetVersion <- vector("list",length(frames))
  for (j in 1:length(frames)) {
    tmp <- matrix(frames[[j]]$keypoints, ncol=3, byrow = TRUE)
    score <- frames[[j]]$score
    tmp <- data.frame(tmp, row.names=coco2posenet$cocopart[1:nrow(tmp)])
    names(tmp) <- c("x","y","conf")
    tmp$pnetname <- coco2posenet$posenet[1:nrow(tmp)]
    # now keep only keypoints which are named in posenet
    tmp <- tmp[-excludeRows,]
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

# read into R form openpose
file <- args[1]
poses2 <- convertCOCOdata2(file)

str <- paste0('{"data":',toJSON(poses2, collapse = "\n"),'}')
write(str, paste0(strsplit(file,".json")[[1]][1],"_converted3.json"))

