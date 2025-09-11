// Auth0 Custom Action - Add to Login Flow
// This ensures firstName/lastName are captured during signup

exports.onExecutePostLogin = async (event, api) => {
  // If user is signing up for the first time
  if (event.stats.logins_count === 1) {
    // Ensure we have name fields
    if (event.user.given_name) {
      api.user.setUserMetadata('firstName', event.user.given_name);
    }
    if (event.user.family_name) {
      api.user.setUserMetadata('lastName', event.user.family_name);
    }
    
    // If no given_name/family_name, try to parse from name
    if (!event.user.given_name && !event.user.family_name && event.user.name) {
      const nameParts = event.user.name.split(' ');
      if (nameParts.length >= 2) {
        api.user.setUserMetadata('firstName', nameParts[0]);
        api.user.setUserMetadata('lastName', nameParts.slice(1).join(' '));
      }
    }
  }
  
  // Add name fields to token for our app
  api.idToken.setCustomClaim('given_name', event.user.given_name || event.user.user_metadata?.firstName);
  api.idToken.setCustomClaim('family_name', event.user.family_name || event.user.user_metadata?.lastName);
};