import { defineAbilitiesFor } from "../utils/abilities";

export const checkAbility = (action, subject) => (req, res, next) => {
  const ability = defineAbilitiesFor(req.user);

  if (ability.can(action, subject)) {
    next();
  } else {
    res.status(403).json({
      error: "Forbidden: you do not have access",
    });
  }
};
