
const { Order, Product } = require('../models')

module.exports = {
  async get (req, res) {
    try {
      const orders = await Order.findAll({
        where: {},
        include: [ Product ]
      })

      res.send(orders)
    } catch (error) {
      res.status(500).send({
        error: 'não foi possivel obter lista de vendas'
      })
    }
  },

  async post (req, res) {
    try {
      const order = await Order.create(req.body)

      await Promise.all(req.body.products.map(product => {
        return order.addProduct(product.id, { through: product.order_product })
      }))

      const result = order.get({ plain: true })
      result.products = await order.getProducts()

      res.send(result)
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'não foi possivel adicionar venda'
      })
    }
  },

  async put (req, res) {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!order) {
        return res.status(404).send({
          error: 'não existe registro com esse id'
        })
      }

      await order.update(req.body.order)

      await order.setTasks([])
      await Promise.all(req.body.products.map(product => {
        return order.addProduct(product.id, { through: product.order_product })
      }))

      const result = order.get({ plain: true })
      result.products = await order.getProducts()

      res.send(result)
    } catch (error) {
      res.status(500).send({
        error: 'não foi possivel atualizar venda'
      })
    }
  }
}
