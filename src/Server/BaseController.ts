abstract class BaseController {
  get controllerName() {
    return this.constructor.name.replace('Controller','').toLowerCase();
  }

  index(ctx) { ctx.response.status = 404; }
  show(ctx) { ctx.response.status = 404; }
  create(ctx) { ctx.response.status = 404; }
  destroy(ctx) { ctx.response.status = 404; }

  applyToRouter(router) {
    console.log(this.controllerName);
    router
      .get(`/${this.controllerName}`, this.index)
      .get(`/${this.controllerName}/:id`, this.show)
      .post(`/${this.controllerName}`, this.create)
      .del(`/${this.controllerName}/:id`, this.destroy);
  }
}

export default BaseController;