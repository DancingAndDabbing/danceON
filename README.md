# danceON
dance Object Notation

## Example Code
```javascript
(pose, poseHistory) => [
    {
        what: 'circle',
        when: true,
        where: {
            x: pose.leftWrist.x,
            y: pose.leftWrist.y,
        },
        how: {
            d: [30, 60, 80],
            fill: 'rgba(0,0,255, 0.25)',
            stroke: 50
        }
    },
    {
        what: 'circle',
        when: pose.rightWrist.y < pose.rightHip.y,
        where: {
            start: {
                x: pose.rightWrist.x,
                y: pose.rightWrist.y,
                velocityX: random(-12, -7),
                velocityY: random(-0.6, 0.6)
            },
            accelerationX: 0,
            accelerationY: 0
        },
        how: {
            d: [{frame: 0, value: 0}, {frame: 30, value: 30}],
            fill: 'rgba(255,0,0, 0.25)',
            stroke: 50
        }
    }
];

```
