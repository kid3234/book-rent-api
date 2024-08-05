import { defineAbilitiesFor } from "../utils/abilities.js";

export const checkAbility = (action, subject) => (req, res, next) => {
  const user = req.user; // Ensure req.user is defined
  if (!user) return res.status(401).send('Unauthorized');

  const ability = defineAbilitiesFor(req.user);

  if (ability.can(action, subject)) {
    next();
  } else {
    res.status(403).json({
      error: "Forbidden: you do not have access",
    });
  }
};
