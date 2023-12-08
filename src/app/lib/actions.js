'use server'

import { revalidatePath } from 'next/cache'
import { Product, User } from './models'
import { connectToDB } from './utils'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { signIn } from '../auth'
import { toast } from 'react-toastify'
import { auth, signOut } from '@/app/auth'
import { get } from 'mongoose'
// import { useRouter } from 'next/navigation'

export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData)

  try {
    connectToDB()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive
    })

    await newUser.save()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to create user!')
  }

  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData)

  try {
    connectToDB()

    const updateFields = {
      username,
      email,
      password,
      phone,
      address,
      isAdmin,
      isActive
    }

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === '' || undefined) && delete updateFields[key]
    )

    await User.findByIdAndUpdate(id, updateFields)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to update user!')
  }

  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData)

  try {
    connectToDB()
    await User.findByIdAndDelete(id)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to delete user!')
  }

  revalidatePath('/dashboard/products')
}


export const addProduct = async (formData) => {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData)

  try {
    connectToDB()

    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size
    })

    await newProduct.save()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to create product!')
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export const updateProduct = async (formData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData)

  try {
    connectToDB()

    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size
    }

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === '' || undefined) && delete updateFields[key]
    )

    await Product.findByIdAndUpdate(id, updateFields)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to update product!')
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData)

  try {
    connectToDB()
    await Product.findByIdAndDelete(id)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to delete product!')
  }

  revalidatePath('/dashboard/products')
}

// export const authenticate2 = async ( prevState, formData) => {
//   const { username, password } = Object.fromEntries(formData)

//   try {
//     await signIn('credentials', { username, password }, { callbackUrl: '/dashboard' })
//   } catch (err) {
//     return 'Wrong Credentials!'
//   }
// }

export const authenticate = async ( formData) => {
  const { username, password } = formData
  // const router = useRouter()
  try {
    await signIn('credentials', { username, password, redirect: false })

  } catch (err) {
    console.log('err', err)
    console.log(err.name, err.message)
    // return { error:err.name+' '+ err.message }
    return { error:'Incorrect Password!' }
  }
}

export const getDataTimeLeave = async () => {
  try {
    const { user } = await auth()
    const arr=[]
    const typeLeave = await
    fetch(`${process.env.API_PATH}/V1/leave/${user.username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Headers':'X-CSRF-Token'
        }
      })
      .then(response => response.json())
      .then(data => {
        data.map((item) => (
          arr.push(item)
        ))
      })

    return arr
  } catch (err) {
    console.log(err)
    throw new Error('Failed to get time leave for user!')
  }

}


export const logTimeTotal = async (arr_log =[]) => {

  'use server'

  const t = arr_log.reduce(function(a, b) {
    return Number(a) + Number((b['timeworked'] / 3600).toFixed(2))
  }, 0)


  return t
}

export const logTimeTotalIssue = async (arr_log =[]) => {

  'use server'

  const final = arr_log.map((item) => {
    let t2 = Object.values(item['logs']).reduce(function(a, b) {
      return Number(a) + Number((b['timeworked'] / 3600).toFixed(2))
    }, 0)
    return t2
  }).reduce((prev, curr) => prev + curr, 0)

  return final

}


export const logTimeTotalIssueByDay = (arr_log =[], number_day) => {

  'use server'
  var final = 0
  var t2 = 0
  arr_log.map((item) => {

    Object.values(item['logs']).map((item2) => {
      var createDate = item2['created'].substring(0, 10)
      var createDate_arr = createDate.split('-')
      var get_day = createDate_arr[2]

      if (Number(number_day) == get_day) {
        var ts = Number((item2['timeworked'] / 3600).toFixed(2))
        t2 += ts

      }
    })
    final = t2
  })

  return final


}
export const logTimeElement= (arr_log =[], ind) => {

  let timeworked
  let day_worked
  {arr_log.map((element) => {

    var createDate = element['created'].substring(0, 10)
    var createDate_arr = createDate.split('-')
    var get_day = createDate_arr[2]
    if (Number(ind) == get_day) {
      timeworked = Number((element['timeworked'] / 3600).toFixed(2))
      day_worked = get_day
    }
  })}

  return timeworked

}

export const getDatefromDay = (day, thismonth, thisyear) => {
  let fullday = thismonth + '/' + day + '/' + thisyear
  let dt = new Date(fullday)
  // console.log('fullday', fullday)
  // console.log('dttttt', dt)
  // console.log('getday', dt.getDay())
  let days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')
  return days[dt.getDay()].toUpperCase().slice(0, 2)
}
