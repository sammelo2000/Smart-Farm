import { useState, useEffect } from "react"
import { db, auth } from "../config/firebase"
import { Auth } from "../components/auth"
import Sidebar from "../components/Sidebar"

import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import DeleteIcon from "../assets/svg/deleteIcon.svg?react"
import EditIcon from "../assets/svg/editIcon.svg?react"

const Crops = () => {
  const [cropList, setCropList] = useState([])

  const [newCropType, setNewCropType] = useState("")
  const [newCropNumber, setNewCropNumber] = useState("")

  const [updatedSize, setUpdatedSize] = useState("")
  const [updatedNumber, setUpdatedNumber] = useState("")
  const [updatedType, setUpdatedType] = useState("")

  const cropsCollectionRef = collection(db, "crops")

  const getCropList = async () => {
    try {
      const data = await getDocs(cropsCollectionRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log(filteredData)
      setCropList(filteredData)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getCropList()
  }, [])

  const onSubmitCrop = async (e) => {
    try {
      await addDoc(cropsCollectionRef, {
        type: newCropType,
        number: newCropNumber,
        // size: newCropSize,
        userId: auth?.currentUser?.uid,
      })
      getCropList()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCrop = async (id) => {
    const cropDoc = doc(db, "crops", id)
    await deleteDoc(cropDoc)
    getCropList()
  }
  const updateCrop = async (id) => {
    const cropDoc = doc(db, "crops", id)
    await updateDoc(cropDoc, { 
      avgSize: updatedSize, 
      number: updatedNumber, 
      type: updatedType 
    })
    getCropList()
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto py-4">
        <div className="flex items-center space-x-4">
          <input
            className="p-2 border border-gray-300 rounded"
            placeholder="Crop type"
            onChange={(e) => setNewCropType(e.target.value)}
          />
          <input
            className="p-2 border border-gray-300 rounded"
            placeholder="Number"
            type="text"
            onChange={(e) => setNewCropNumber(e.target.value)}
          />
          <button
            className="p-2 bg-green-700 text-white rounded hover:bg-green-700"
            onClick={onSubmitCrop}
          >
            Add Crop
          </button>
        </div>
        <div className="mt-2">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-0.5 border border-gray-300 w-1/3">Type</th>
                <th className="p-0.5 border border-gray-300 w-1/3">Number</th>
                <th className="p-0.5 border border-gray-300 w-1/3">Average Size</th>
                <th className="p-0.5 border border-gray-300 w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cropList.map((crop) => (
                <tr key={crop.id}>
                  <td className="p-0.5 border border-gray-300">{crop.type}</td>
                  <td className="p-0.5 border border-gray-300">{crop.number}</td>
                  <td className="p-0.5 border border-gray-300">{crop.avgSize}</td>
                  <td className="p-0.5 border border-gray-300 flex space-x-2">
                    <div onClick={() => deleteCrop(crop.id)}>
                      <DeleteIcon width={20} height={20} />
                    </div>
                    <div onClick={(e) => updateCrop(crop.id)}>
                      <EditIcon fill="#ffffff" width={20} height={20} />
                    </div>
                    <input
                      className="p-0.5 border border-gray-300 rounded"
                      placeholder="New Size"
                      onChange={(e) => setUpdatedSize(e.target.value)}
                    />
                    <input
                      className="p-0.5 border border-gray-300 rounded"
                      placeholder="New Number"
                      onChange={(e) => setUpdatedNumber(e.target.value)}
                    />
                    <input
                      className="p-0.5 border border-gray-300 rounded"
                      placeholder="New Type"
                      onChange={(e) => setUpdatedType(e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Crops
