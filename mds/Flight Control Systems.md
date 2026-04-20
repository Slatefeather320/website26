
After graduating high school but before starting college, (April to July 2024) I was working in a Gurgaon based Aerospace start up called [Sharang Shakti](https://sharangshakti.com/). I worked on the non-lethal counter UAV [HantR](https://sharangshakti.com/hantr-interceptor).

This project's goal was to have a system capable of detecting, chasing after, and disabling another UAV using a net launching system. 
***

My role was split into two parts: 

## State Estimation 
I implemented an extended [Kalman Filter](https://en.wikipedia.org/wiki/Kalman_filter). This process involved research, testing different projection functions, writing embedded code for flight controllers, flying the drone, and a lot of trial and error feedback looping. I also wrote a paper documenting this entire process and the final algorithm. 

As a very high level explanation, the state estimation algorithm I wrote takes accelerometer data and fuses it with the GPS data to get a better state estimation than either of those sources alone would have provided. Accelerometers have a low error but it builds up fast when integrating to position, GPS has no error which builds up over time but it is less accurate. 

## Sensor Calibration 
I implemented an algorithm to reduce the error found in acceleration data reported by the IMU. Once again, it was a feedback loop of doing research, finding suitable algorithms, writing the code, finding coefficients, flying the drone, and measuring error between actual state and reported state. 

As a high level explanation, the final algorithm uses a known starting state, level with the horizon experience one g of force downward and uses [differential evolution](https://en.wikipedia.org/wiki/Differential_evolution) to calibrate the magnitude and orientation reported by the IMU separately. Earlier versions of the algorithm used gradient descent instead but I found DE reduce error more efficiently, with less calibration time.  

## State Estimation Paper 
![[Extended Kalman Filter Implementation Revised.pdf]]

## Sensor Calibration Paper 
![[Sensor Calibration Theory.pdf]]

***
## In Retrospect 
It has been slightly less than 2 years between me working on this project and me being able to write about it here. Going over my work again, I think there are several theoretical problems. Particularly, I question how well calibrating magnitude and orientation separately works. I think this would severely overfit for the default upright position of the drone. I remember considering running the direction calibration algorithm on a few predefined angles instead of just upright though I was not around to see that get implemented. 

Several other people have worked on this projected since I left and I am confident they have something more theoretically sound than my first stab at the problem now.  

Even if the algorithms I wrote are less than ideal, I think it is better to leave them up for others to see as a stepping stone to getting the right thing or at least a memento from a very fun part of my life. Accepting all feedback and discussion now that this project is public; you can reach me on [LinkedIn](https://www.linkedin.com/in/sanilarora/). 