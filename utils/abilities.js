// import pkg from "casl";
// const { Ability, AbilityBuilder } = pkg;

// export const defineAbilitiesFor = (user) => {
//   const { can, cannot, rules } = new AbilityBuilder(Ability);
  
//   if (user.role === 'admin') {
//     can('manage', 'all');
//   } else if (user.role === 'owner') {
//     can('read', 'Book');
//     can('create', 'Book');
//     can('update', 'Book', { ownerId: user.id });
//     can('delete', 'Book', { ownerId: user.id });
//     cannot('manage', 'User');
//   } else if (user.role === 'renter') {
//     can('read', 'Book');
//     cannot('manage', 'Book');
//   }

//   return new Ability(rules);
// }
import { Ability, AbilityBuilder } from '@casl/ability';

export const defineAbilitiesFor = (user) => {
  // Initialize AbilityBuilder with the Ability class
  const { can, cannot, build } = new AbilityBuilder(Ability);

  // Define permissions based on the user's role
  if (user.role === 'admin') {
    can('manage', 'all'); // Admins can manage everything
  } else if (user.role === 'owner') {
    can('read', 'Book');
    can('create', 'Book');
    can('update', 'User')
    can('update', 'Book', { ownerId: user.id });
    can('delete', 'Book', { ownerId: user.id });
    cannot('manage', 'User');
  } else if (user.role === 'renter') {
    can('read', 'Book');
    cannot('manage', 'Book');
  }

  // Build and return the Ability instance with the defined rules
  return build();
}
