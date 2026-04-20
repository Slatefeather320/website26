After graduating high school but before starting college, (April to July 2024) I was working in a Gurgaon based Aerospace start up called [Sharang Shakti](https://sharangshakti.com/). I worked on the non-lethal counter UAV [HantR](https://sharangshakti.com/hantr-interceptor)

This project's goal was to have a system capable of detecting, chasing after, and disabling another UAV using a net launching system. 
***

My role was split into two parts: 

## State Estimation 
I implemented an extended [Kalman Filter](https://en.wikipedia.org/wiki/Kalman_filter). This process involved research, testing different projection functions, writing embedded code for flight controllers, flying the drone, and a lot of trial and error feedback looping. I also wrote a paper documenting this entire process and the final algorithm. Currently, I can not put that paper up here. 

As a very high level explanation, the state estimation algorithm I wrote takes accelerometer data and fuses it with the GPS data to get a better state estimation than either of those sources alone would have provided. Accelerometers have a low error but it builds up fast when integrating to position, GPS has no error which builds up over time but it is less accurate. 

## Sensor Calibration 
I implemented an algorithm to reduce the error found in acceleration data reported by the IMU. Once again, it was a feedback loop of doing research, finding suitable algorithms, writing the code, finding coefficients, flying the drone, and measuring error between actual state and reported state. This too has a paper documenting the process and final algorithm which I cannot share yet. 

As a high level explanation, the final algorithm uses a known starting state, level with the horizon experience one g of force downward and uses [differential evolution](https://en.wikipedia.org/wiki/Differential_evolution) to calibrate the magnitude and orientation reported by the IMU separately. Earlier versions of the algorithm used gradient descent instead but I found DE reduce error more efficiently, with less calibration time.  