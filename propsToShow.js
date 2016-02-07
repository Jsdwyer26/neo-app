var propKeys = {
  diameter_miles: neo.estimated_diameter.miles.estimated_diameter_max,
  diameter_feet: neo.estimated_diameter.feet.estimated_diameter_max,
  diameter_km: neo.estimated_diameter.kilometers.estimated_diameter_max,
  diameter_m: neo.estimated_diameter.meters.estimated_diameter_max,
  diameter_m: neo.estimated_diameter.meters.estimated_diameter_max,
  magnitude: neo.absolute_magnitude_h,
  missDist: neo.close_approach_data[0].miss_distance.miles,
  approachDate: neo.close_approach_data[0].close_approach_date,
  velocity: neo.close_approach_data[0].relative_velocity.miles_per_hour
}
value = propKeys[prop];