const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },
  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONSUPDATE"]);

    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }
    const order = await ctx.db.query.order({ where: { id: args.id } }, info);

    if (!order) {
      return null;
    }

    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToShow = ctx.request.user.permissions.includes("ADMIN");
    if (!ownsOrder || !hasPermissionToShow) {
      throw new Error("You cant see this order");
    }

    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that!");
    }

    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId }
        }
      },
      info
    );
  }
};

module.exports = Query;
