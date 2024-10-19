'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '../../contexts/AuthContext'
import FileUpload from '../../components/FileUpload'
import { getShapes, createShape, updateShape, getFiles, deleteShape } from '../../utils/api'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Dashboard() {
  const [shapes, setShapes] = useState([])
  const [files, setFiles] = useState([])
  const [editingShape, setEditingShape] = useState(null)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchShapes()
      fetchFiles()
    }
  }, [user])

  const fetchShapes = async () => {
    try {
      const fetchedShapes = await getShapes()
      setShapes(fetchedShapes || [])
    } catch (error) {
      console.error('Failed to fetch shapes', error)
      setShapes([])
    }
  }

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const fetchedFiles = await getFiles()
      setFiles(fetchedFiles)
    } catch (error) {
      console.error('Failed to fetch files', error)
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUploadSuccess = async (uploadedFile) => {
    await fetchFiles()
    setShapes(prevShapes => [...prevShapes, {
      id: `file-${uploadedFile.id}`,
      data: uploadedFile.content,
      name: uploadedFile.name
    }])
  }

  const handleShapeCreated = async (newShape) => {
    try {
      const createdShape = await createShape(newShape)
      setShapes(prevShapes => [...prevShapes, createdShape])
    } catch (error) {
      console.error('Failed to create shape', error)
    }
  }

  const handleShapeEdit = (shape) => {
    setEditingShape(shape)
  }

  const handleShapeUpdate = async (updatedShape) => {
    try {
      await updateShape(updatedShape.id, updatedShape)
      setShapes(prevShapes => prevShapes.map(shape => 
        shape.id === updatedShape.id ? updatedShape : shape
      ))
      setEditingShape(null)
    } catch (error) {
      console.error('Failed to update shape', error)
    }
  }

  const handleShapeDelete = async (shapeId) => {
    try {
      await deleteShape(shapeId)
      setShapes(prevShapes => prevShapes.filter(shape => shape.id !== shapeId))
    } catch (error) {
      console.error('Failed to delete shape', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Geospatial Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Upload File</h2>
          <FileUpload onUploadSuccess={handleFileUploadSuccess} />
          <h2 className="text-xl font-bold mt-8 mb-4">Uploaded Files</h2>
          {isLoading ? (
            <p>Loading files...</p>
          ) : files.length > 0 ? (
            <ul className="list-disc pl-5">
              {files.map((file) => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Map</h2>
          <Map 
            shapes={shapes} 
            onShapeCreated={handleShapeCreated} 
            onShapeEdit={handleShapeEdit}
            editingShape={editingShape}
            onShapeUpdate={handleShapeUpdate}
            onShapeDelete={handleShapeDelete}
          />
        </div>
      </div>
    </div>
  )
}