"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  User,
  Code,
  Calendar,
  MapPin,
  List,
  Trash2,
  Phone,
  Smartphone,
  Mail,
  Download,
  Upload,
  AlertTriangle,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Tipo para los datos del estudiante
type StudentData = {
  id: string
  name: string
  code: string
  entryDate: string
  address: string
  landline: string // Teléfono fijo
  mobile: string // Teléfono celular
  email: string // Correo electrónico
  timestamp: Date
}

// Componente de confeti
const Confetti = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    if (!active) return

    const colors = ["#FF577F", "#FF884B", "#FFFE7A", "#A3F7BF", "#9055FF"]
    const newParticles = []

    for (let i = 0; i < 100; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 5 + 2,
        angle: Math.random() * 2 - 1,
      })
    }

    setParticles(newParticles)

    const timeout = setTimeout(() => {
      setParticles([])
    }, 3000)

    return () => clearTimeout(timeout)
  }, [active])

  useEffect(() => {
    if (particles.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const updatedParticles = [...particles]

      for (let i = 0; i < updatedParticles.length; i++) {
        const p = updatedParticles[i]

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.y += p.speed
        p.x += p.angle

        if (p.y > window.innerHeight) {
          updatedParticles.splice(i, 1)
          i--
        }
      }

      setParticles(updatedParticles)

      if (updatedParticles.length > 0) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [particles])

  if (!active && particles.length === 0) return null

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />
}

export default function StudentForm() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    entryDate: "",
    address: "",
    landline: "",
    mobile: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    code: "",
    entryDate: "",
    address: "",
    landline: "",
    mobile: "",
    email: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [registeredStudents, setRegisteredStudents] = useState<StudentData[]>([])
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validation patterns
  const patterns = {
    name: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, // Letters and spaces, including Spanish characters
    code: /^[1-9]\d{7}$/, // 8 digits, not starting with 0
    entryDate: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
    address: /^[A-Za-zÁáÉéÍíÓóÚúÑñ0-9\s\-.,#]+$/, // Letters, numbers, spaces, and some special characters
    landline: /^6056\d{6}$/, // 10 digits starting with 6056
    mobile: /^3\d{9}$/, // 10 digits starting with 3
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email validation
  }

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const validateField = (name: string, value: string) => {
    if (!value) {
      return "Este campo es obligatorio"
    }

    if (!patterns[name as keyof typeof patterns].test(value)) {
      switch (name) {
        case "name":
          return "El nombre solo debe contener letras y espacios"
        case "code":
          return "El código debe tener 8 dígitos y no empezar con 0"
        case "entryDate":
          return "La fecha debe tener formato YYYY-MM-DD"
        case "address":
          return "La dirección contiene caracteres no permitidos"
        case "landline":
          return "El teléfono fijo debe tener 10 dígitos y empezar con 6056"
        case "mobile":
          return "El teléfono celular debe tener 10 dígitos y empezar con 3"
        case "email":
          return "Ingrese un correo electrónico válido"
        default:
          return "Formato inválido"
      }
    }

    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      code: validateField("code", formData.code),
      entryDate: validateField("entryDate", formData.entryDate),
      address: validateField("address", formData.address),
      landline: validateField("landline", formData.landline),
      mobile: validateField("mobile", formData.mobile),
      email: validateField("email", formData.email),
    }

    setErrors(newErrors)

    // Check if there are any errors
    if (Object.values(newErrors).every((error) => error === "")) {
      // Check if code already exists
      if (registeredStudents.some((student) => student.code === formData.code)) {
        setErrors({
          ...newErrors,
          code: "Este código de estudiante ya existe",
        })
        return
      }

      // Add new student to the list
      const newStudent: StudentData = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date(),
      }

      setRegisteredStudents([...registeredStudents, newStudent])
      setSubmitted(true)
      setShowConfetti(true)

      // Reset form
      setFormData({
        name: "",
        code: "",
        entryDate: "",
        address: "",
        landline: "",
        mobile: "",
        email: "",
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)

      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
    }
  }

  const handleDelete = (id: string) => {
    setRegisteredStudents(registeredStudents.filter((student) => student.id !== id))
  }

  const handleExportJSON = () => {
    setIsExporting(true)

    setTimeout(() => {
      // Create a JSON string from the registeredStudents array
      const jsonData = JSON.stringify(registeredStudents, null, 2)

      // Create a Blob with the JSON data
      const blob = new Blob([jsonData], { type: "application/json" })

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob)

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a")
      a.href = url
      a.download = `estudiantes_registrados_${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsExporting(false)
    }, 800) // Simulating a delay for the animation
  }

  const handleImportClick = () => {
    // Clear previous messages
    setImportError(null)
    setImportSuccess(null)

    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const importedData = JSON.parse(content)

        // Validate the imported data
        if (!Array.isArray(importedData)) {
          setImportError("El archivo no contiene un formato válido de lista de estudiantes")
          setIsImporting(false)
          return
        }

        // Validate each student and collect valid ones
        const validStudents: StudentData[] = []
        const existingCodes = new Set(registeredStudents.map((student) => student.code))
        let duplicateCount = 0
        let invalidCount = 0

        importedData.forEach((student: any) => {
          // Check if student has all required fields
          const requiredFields = ["name", "code", "entryDate", "address", "landline", "mobile", "email"]
          const hasAllFields = requiredFields.every((field) => student[field] !== undefined)

          if (!hasAllFields) {
            invalidCount++
            return
          }

          // Validate each field
          const isValid = requiredFields.every((field) => !validateField(field, student[field]))

          if (!isValid) {
            invalidCount++
            return
          }

          // Check for duplicates
          if (existingCodes.has(student.code)) {
            duplicateCount++
            return
          }

          // Add valid student
          existingCodes.add(student.code)
          validStudents.push({
            ...student,
            id: student.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: student.timestamp ? new Date(student.timestamp) : new Date(),
          })
        })

        setTimeout(() => {
          if (validStudents.length === 0) {
            setImportError(
              `No se pudo importar ningún estudiante. ${invalidCount} registros inválidos, ${duplicateCount} duplicados.`,
            )
            setIsImporting(false)
            return
          }

          // Add valid students to the list
          setRegisteredStudents((prev) => [...prev, ...validStudents])

          // Show success message
          setImportSuccess(
            `Se importaron ${validStudents.length} estudiantes correctamente${invalidCount > 0 ? `, ${invalidCount} registros inválidos` : ""}${duplicateCount > 0 ? `, ${duplicateCount} duplicados ignorados` : ""}.`,
          )

          // Clear the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }

          // Hide success message after 5 seconds
          setTimeout(() => {
            setImportSuccess(null)
          }, 5000)

          setIsImporting(false)
        }, 800) // Simulating a delay for the animation
      } catch (error) {
        setImportError("Error al procesar el archivo JSON. Verifique el formato.")
        console.error("Error importing JSON:", error)
        setIsImporting(false)
      }
    }

    reader.onerror = () => {
      setImportError("Error al leer el archivo")
      setIsImporting(false)
    }

    reader.readAsText(file)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const toggleExpandStudent = (id: string) => {
    if (expandedStudent === id) {
      setExpandedStudent(null)
    } else {
      setExpandedStudent(id)
    }
  }

  // Animated background bubbles
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    left: Math.random() * 100,
    animationDuration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div
      className={`min-h-screen p-6 relative overflow-hidden transition-colors duration-500 ${darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"}`}
    >
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full opacity-10 dark:opacity-5 bg-gradient-to-r from-purple-400 to-indigo-500 animate-float"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDuration: `${bubble.animationDuration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>

      <Confetti active={showConfetti} />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center text-indigo-800 dark:text-indigo-300"
          >
            Sistema de Registro Estudiantil
          </motion.h1>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 text-indigo-600 dark:text-indigo-300"
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-xl border-0 overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 dark:text-white">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Registro de Estudiante
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Complete el formulario con los datos requeridos
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-indigo-700 dark:text-indigo-300">
                      Nombre Estudiante
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre completo"
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-indigo-700 dark:text-indigo-300">
                      Código Estudiante
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <Code className="h-4 w-4" />
                      </div>
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Ingrese el código de 8 dígitos"
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.code ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.code && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.code}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entryDate" className="text-indigo-700 dark:text-indigo-300">
                      Fecha de Ingreso
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <Input
                        id="entryDate"
                        name="entryDate"
                        type="date"
                        value={formData.entryDate}
                        onChange={handleChange}
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.entryDate ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.entryDate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.entryDate}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-indigo-700 dark:text-indigo-300">
                      Dirección
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ingrese la dirección"
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.address ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.address && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.address}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landline" className="text-indigo-700 dark:text-indigo-300">
                      Teléfono Fijo
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <Input
                        id="landline"
                        name="landline"
                        value={formData.landline}
                        onChange={handleChange}
                        placeholder="Ingrese el teléfono fijo (6056XXXXXX)"
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.landline ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.landline && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.landline}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-indigo-700 dark:text-indigo-300">
                      Teléfono Celular
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Ingrese el teléfono celular (3XXXXXXXXX)"
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.mobile ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.mobile && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.mobile}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-indigo-700 dark:text-indigo-300">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ingrese el correo electrónico"
                        className={`pl-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500" : "border-indigo-200 focus:border-indigo-400 dark:focus:border-indigo-300"}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1 overflow-hidden"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.email}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {submitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-md text-emerald-700 dark:text-emerald-300 flex items-center gap-2 border border-emerald-200 dark:border-emerald-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Estudiante registrado correctamente</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter>
                  <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Registrar Estudiante
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          {/* Listado de Estudiantes Registrados */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <Card className="shadow-xl border-0 overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 dark:text-white h-full">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  <CardTitle>Listado de Estudiantes</CardTitle>
                </div>
                <CardDescription className="text-emerald-100">
                  {registeredStudents.length} estudiante(s) registrado(s)
                </CardDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  {registeredStudents.length > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleExportJSON}
                        variant="secondary"
                        size="sm"
                        disabled={isExporting}
                        className="bg-white text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 transition-all duration-300"
                      >
                        {isExporting ? (
                          <div className="flex items-center gap-1">
                            <div className="h-4 w-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                            Exportando...
                          </div>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Exportar JSON
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleImportClick}
                      variant="secondary"
                      size="sm"
                      disabled={isImporting}
                      className="bg-white text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 transition-all duration-300"
                    >
                      {isImporting ? (
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                          Importando...
                        </div>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Importar JSON
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileChange} className="hidden" />
                </div>

                <AnimatePresence>
                  {importError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 bg-red-50 dark:bg-red-900/30 p-2 rounded-md text-red-700 dark:text-red-300 text-sm flex items-center gap-1 border border-red-200 dark:border-red-800"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      {importError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {importSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-md text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {importSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardHeader>
              <CardContent className="pt-6 overflow-auto max-h-[600px]">
                <AnimatePresence>
                  {registeredStudents.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {registeredStudents.map((student) => (
                        <motion.div
                          key={student.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          layout
                          className={`p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 ${expandedStudent === student.id ? "ring-2 ring-emerald-300 dark:ring-emerald-500" : ""}`}
                        >
                          <div
                            className="flex justify-between items-start mb-2 cursor-pointer"
                            onClick={() => toggleExpandStudent(student.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                                <User className="h-5 w-5" />
                              </div>
                              <h3 className="font-medium text-emerald-800 dark:text-emerald-300">{student.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleExpandStudent(student.id)
                                }}
                              >
                                {expandedStudent === student.id ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(student.id)
                                }}
                                className="h-8 w-8 flex items-center justify-center rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedStudent === student.id ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pl-7 pt-2 border-t border-gray-100 dark:border-gray-600">
                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Code className="h-3 w-3" /> Código
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{student.code}</span>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> Fecha de Ingreso
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                      {formatDate(student.entryDate)}
                                    </span>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" /> Dirección
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{student.address}</span>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Phone className="h-3 w-3" /> Teléfono Fijo
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{student.landline}</span>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Smartphone className="h-3 w-3" /> Teléfono Celular
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{student.mobile}</span>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Mail className="h-3 w-3" /> Correo Electrónico
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{student.email}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 mt-2 pl-10">
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Code className="h-3 w-3" />
                                  <span className="text-gray-700 dark:text-gray-300">{student.code}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Mail className="h-3 w-3" />
                                  <span className="text-gray-700 dark:text-gray-300">{student.email}</span>
                                </div>
                              </div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex justify-center mb-4">
                        <List className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p>No hay estudiantes registrados</p>
                      <p className="text-sm mt-2">Complete el formulario para agregar estudiantes a la lista</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

