import { Product, User } from './models'
import { connectToDB } from './utils'


export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, 'i')

  const ITEM_PER_PAGE = 2

  try {
    connectToDB()
    const count = await User.find({ username: { $regex: regex } }).count()
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
    return { count, users }
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch users!')
  }
}

export const fetchUser = async (id) => {
  console.log(id)
  try {
    connectToDB()
    const user = await User.findById(id)
    return user
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch user!')
  }
}

export const fetchProducts = async (q, page) => {
  console.log(q)
  const regex = new RegExp(q, 'i')

  const ITEM_PER_PAGE = 2

  try {
    connectToDB()
    const count = await Product.find({ title: { $regex: regex } }).count()
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
    return { count, products }
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch products!')
  }
}

export const fetchProduct = async (id) => {
  try {
    connectToDB()
    const product = await Product.findById(id)
    return product
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch product!')
  }
}

export const fetchUserAction = async () => {
  try {
    const res = await fetch('http://localhost:8000/dataUserAction')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
  
    return res.json()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch data!')
  }
}

// DUMMY DATA

export const cards = [
  {
    id: 1,
    title: 'Total Users',
    number: 10.928,
    change: 12
  },
  {
    id: 2,
    title: 'Stock',
    number: 8.236,
    change: -2
  },
  {
    id: 3,
    title: 'Revenue',
    number: 6.642,
    change: 18
  }
]
