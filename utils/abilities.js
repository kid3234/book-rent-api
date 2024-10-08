import { Ability, AbilityBuilder } from "@casl/ability";

export const defineAbilitiesFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === "admin") {
    can("manage", "all");
  } else if (user.role === "owner") {
    can("read", "Book");
    can("create", "Book");
    can("update", "User");
    can("update", "Book", { ownerId: user.id });
    can("delete", "Book", { ownerId: user.id });
    cannot("manage", "User");
  } else if (user.role === "renter") {
    can("read", "Book");
    cannot("manage", "Book");
  }

  return build();
};
