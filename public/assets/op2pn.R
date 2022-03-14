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


body2posenet <- structure(list(keypt0 = 0:24, 
                               body25part = c("Nose", "Neck", 
                                              "RShoulder", "RElbow", "RWrist", "LShoulder", "LElbow", "LWrist", 
                                              "MidHip", "RHip", "RKnee", "RAnkle", "LHip", "LKnee", "LAnkle", 
                                              "REye", "LEye", "REar", "LEar", "LBigToe", "LSmallToe", "LHeel", 
                                              "RBigToe", "RSmallToe", "RHeel"), 
                               pnetpart = c("nose", NA, "rightShoulder", 
                                            "rightElbow", "rightWrist", "leftShoulder", "leftElbow", "leftWrist", 
                                            NA, "rightHip", "rightKnee", "rightAnkle", "leftHip", "leftKnee", 
                                            "leftAnkle", "rightEye", "leftEye", "rightEar", "leftEar", NA, 
                                            NA, NA, NA, NA, NA)), 
                          class = "data.frame", 
                          row.names = c(NA, -25L))



excludeRowsCoco <- which(is.na(coco2posenet$posenet))
excludeRowsBody25 <- which(is.na(body2posenet$pnetpart))


# need to accommodate this ordering
# ['nose', '0'],
# ['leftEye', '16'], ['rightEye', '15'],
# ['leftEar', '18'], ['rightEar', '17'],
# ['leftShoulder', '5'], ['rightShoulder', '2'],
# ['leftElbow', '6'], ['rightElbow', '3'],
# ['leftWrist', '7'], ['rightWrist', '4'],
# ['leftHip', '12'], ['rightHip', '9'],
# ['leftKnee', '13'], ['rightKnee', '10'],
# ['leftAnkle', '14'], ['rightAnkle', '11']

newOrder <- c('nose', 'leftEye', 'rightEye',
                      'leftEar', 'rightEar',
                      'leftShoulder', 'rightShoulder',
                      'leftElbow', 'rightElbow',
                      'leftWrist', 'rightWrist',
                      'leftHip', 'rightHip',
                      'leftKnee', 'rightKnee',
                      'leftAnkle','rightAnkle')

####

convertBODY25data <- function(jsonfile) {
  frames <- fromJSON(jsonfile)
  poseNetVersion <- vector("list",length(frames))
  for (j in 1:length(frames)) {
    tmp <- matrix(frames[[j]]$people[[1]]$pose_keypoints_2d, ncol=3, byrow = TRUE)
    score <- frames[[j]]$score
    tmp <- data.frame(tmp, row.names=body2posenet$body25part[1:nrow(tmp)])
    names(tmp) <- c("x","y","conf")
    tmp$pnetname <- body2posenet$pnetpart[1:nrow(tmp)]
    # now keep only keypoints which are named in posenet
    tmp <- tmp[which(!is.na(body2posenet$pnetpart)),]
    # and finally reorder to match Willie's code
    rownames(tmp) <- tmp$pnetname
    tmp <- tmp[newOrder,]
    # now create poseNet structure
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
    # and finally reorder to match Willie's code
    rownames(tmp) <- tmp$pnetname

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
# poses2 <- convertCOCOdata2(file)
poses2 <- convertBODY25data(file)

str <- paste0('{"data":',toJSON(poses2, collapse = "\n"),'}')
write(str, paste0(strsplit(file,".json")[[1]][1],"_cyb.json"))
