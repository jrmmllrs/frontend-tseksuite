import axios from 'axios'
import { transformResult, transformExaminers } from '../helpers/helpers';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token");
  }

  console.log('Token', token)

  return {
    id: 1,
    name: "Francis Alex",
    role: "Admin",
    token,
  };
};


export const loginUser = async ( loginCredentials ) => {

    return {
        token: "thisissampletoken",
        id: 1,
        name: 'Francis alex',
        role: 'Admin',
        ...loginCredentials
    }
}

export const getAllResults = async() => {
      try {

        const res = await axios.get(`${API_BASE_URL}/result/get`);
        if(!res) {console.log('Error, API')}

        console.log(res.data.data)

        const formatted = res.data.data.map(transformResult);
        
        
        return formatted

      } catch (error) {
        console.error(error)
        toast.error(error)
      }
}

export const getAllExaminers = async()=> {
  
  try {
    const res = await axios.get(`${API_BASE_URL}/examiner/get`)

    if(!res){console.log('Failed to fetch data!')}

    const formattedData = res.data.data.map(transformExaminers)

    return formattedData

  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const getAllDepartments = async() => {

  try {
    const res = await axios.get(`${API_BASE_URL}/department/get`)

    if(!res) { console.log("Cannot fetch departments!") }

    return res.data.data
    
  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const toggleDepartmentActiveStatus = async(department) => {

  try {

    await axios.patch(
          `${API_BASE_URL}/department/toggle-status/${department.dept_id}`,
          {
            is_active: !department.is_active,
          }
        );

  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const addDepartment = async(newDeptName) => {
  try {
    await axios.post(`${API_BASE_URL}/department/create`, {
            dept_name: newDeptName,
            is_active: true,
          });
  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const editDepartment = async(editingDept) => {
  try {
    await axios.put(
        `${API_BASE_URL}/department/update/${editingDept.dept_id}`,
        {
          dept_name: editingDept.dept_name,
        }
      );
  } catch (error) {

    console.error(error)
    toast.error(error)

  }
}

export const deleteDepartment = async(deletingDept) => {
  try {
    await axios.delete(`${API_BASE_URL}/department/delete/${deletingDept.dept_id}`);
  } catch (error) {
    console.error(error)
    toast.error(error)
  }
}

export const submitResults = async({results, examiner_id}) => {
  try {

    const body  = {
      quiz_id: quiz_id,
      examiner_id: examiner_id,
      answers : [
        { 
          question_id : question_id,
          answer_id : answer_id,
        },
      ],
      status: 'COMPLETED'

    }

    await axios.post('url', body )
  } catch (error) {
    
  }
}
