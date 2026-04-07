// import { Clock } from "three";

// /**
//  * Accelerates a value towards a target value.
//  */
// export default class AccelerateValue {
//   clock = new Clock();
//   current: number;
//   target: number;
//   acceleration: number;
//   velocity = 0;
//   maxVelocity = 10;

//   constructor(current: number, acceleration: number) {
//     this.current = current;
//     this.target = current;
//     this.acceleration = acceleration;
//   }

//   setTarget(target: number) {
//     this.target = target;
//   }

//   getCurrent = () => this.current;

//   update() {
//     const dt = this.clock.getDelta();

//     const distance = this.target - this.current;

//     if (Math.abs(distance) > 0.01) {
//       const direction = Math.sign(distance);

//       this.velocity += direction * this.acceleration * dt;
//       this.velocity =
//         Math.min(Math.abs(this.velocity), this.maxVelocity) * direction;

//       this.current += this.velocity * dt;
//     }
//   }
// }
