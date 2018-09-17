(function(accelCalculator, $, undefined) {

	let motorCount = 1,
		ratedTorque = 40,
		currentPercentage = 0.71,
		microstepping = true,
		axisMass = 0.5,
		rotorInertia = 54,
		pulleyRadius = 0.51,
		torqueLossUstep = 0.71,
		torqueLossSafetyFactor = 0.098,
		axisFrictionFactor = 1.0,
		gearRatio = 1.0;

	let calcAcceleration = function() {
		let torqueAtCurrent = ratedTorque * currentPercentage,
			torqueAtUstep = torqueAtCurrent * (microstepping ? torqueLossUstep : 1),
			totalTorque = torqueAtUstep * torqueLossSafetyFactor,
			force = totalTorque / pulleyRadius * motorCount,
			rotorMass = (motorCount * rotorInertia) / (pulleyRadius * pulleyRadius) / 1000.0,
			totalMass = (rotorMass + (axisMass * axisFrictionFactor)) / (gearRatio * gearRatio),
			acceleration = (force/totalMass) * 1000;

		$('#torque_at_current').text(torqueAtCurrent.toFixed(2));
		$('#torque_at_ustep').text(torqueAtUstep.toFixed(2));
		$('#total_torque').text(totalTorque.toFixed(2));
		$('#force').text(force.toFixed(2));
		$('#total_mass').text(totalMass.toFixed(2));
		$('#acceleration').text(acceleration.toFixed(2))
	};

	let updateGearRatio = function() {
		let gearRatio1 = parseFloat($('#gear_ratio_1').val()),
			gearRatio2 = parseFloat($('#gear_ratio_2').val());

		gearRatio = gearRatio1 / gearRatio2;
	};

	let registerChangeHandlers = function() {
		$('#motors_axis').change(function() {
			motorCount = this.valueAsNumber;
			calcAcceleration();
		});
		$('#rated_torque').change(function() {
			ratedTorque = this.valueAsNumber;
			calcAcceleration();
		});
		$('#current_percentage').change(function() {
			currentPercentage = this.valueAsNumber / 100.0;
			calcAcceleration();
		});
		$('#ustep_enabled').change(function() {
			microstepping = this.checked;
			calcAcceleration();
		});
		$('#pulley_radius').change(function() {
			pulleyRadius = this.valueAsNumber;
			calcAcceleration();
		});
		$('#axis_mass').change(function() {
			axisMass = this.valueAsNumber / 1000.0;
			calcAcceleration();
		});
		$('#rotor_intertia').change(function() {
			rotorInertia = this.valueAsNumber;
			calcAcceleration();
		});
		$('#torque_reduction_ustep').change(function() {
			torqueLossUstep = this.valueAsNumber / 100.0;
			calcAcceleration();
		});
		$('#torque_reduction_safety_factor').change(function() {
			torqueLossSafetyFactor = this.valueAsNumber / 100.0;
			calcAcceleration();
		});
		$('#axis_friction_factor').change(function() {
			axisFrictionFactor = this.valueAsNumber;
			calcAcceleration();
		})
		$('[id^=gear_ratio_').change(function() {
			updateGearRatio();
			calcAcceleration();
		});
	};

	accelCalculator.init = function() {
		registerChangeHandlers();
		calcAcceleration();
	}
}(window.accelCalculator = window.accelCalculator || {}, jQuery));

$(document).ready(function() {
	accelCalculator.init();
});
