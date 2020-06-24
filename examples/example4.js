(pose, poseHistory) => [
    {
      what: 'text',
      when: true,
      where: {
        x: pose.leftHip.x,
        y: pose.leftHip.y,
      },
      how: {
          str: 'dance!',
          textSize: 44,
          stroke: 'rgb(255,0,0)',
          fill: 'rgb(255,155,255)'
      }
    },
    {
        what: 'image',
        when: (pose.leftWrist.y < pose.nose.y & pose.rightWrist.y < pose.nose.y),
        where: {
          x: pose.nose.x-40,
          y: pose.nose.y-40,
        },
        how: {
            file: 'assets/devil-face-icon.png',
            dx: 80,
            dy: 80
        }
    },
    {
        what: 'circle',
        when: pose.rightWrist.y < pose.nose.y,
        where: {
            start: {
                x: pose.rightWrist.x,
                y: pose.rightWrist.y,
                velocityX: random(-5, 5),
                velocityY: random(-5, 5)
            },
            accelerationX: 0,
            accelerationY: 0
        },
        how: {
            d: [{frame: 0, value: 0}, {frame: 30, value: 30}],
            fill: 'rgba(255,0,0, 0.25)',
            stroke: 50
        }
    },
    {
        what: 'circle',
        when: pose.leftWrist.y < pose.nose.y,
        where: {
            start: {
                x: pose.leftWrist.x,
                y: pose.leftWrist.y,
                velocityX: random(-5, 5),
                velocityY: random(-5, 5)
            },
            accelerationX: 0,
            accelerationY: 0
        },
        how: {
            d: [{frame: 0, value: 0}, {frame: 30, value: 30}],
            fill: 'rgba(0,255,0, 0.25)',
            stroke: 50
        }
    }
];
