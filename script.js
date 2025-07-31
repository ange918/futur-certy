// Global variables
let isAdminLoggedIn = false
let currentStudent = null

// DOM elements
const searchBtn = document.getElementById('searchBtn')
const matriculeInput = document.getElementById('matriculeInput')
const errorMessage = document.getElementById('errorMessage')
const studentCard = document.getElementById('studentCard')
const adminBtn = document.getElementById('adminBtn')
const adminModal = document.getElementById('adminModal')
const adminPanel = document.getElementById('adminPanel')
const searchSection = document.getElementById('searchSection')

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners()
    // Set current year
    document.getElementById('currentYear').textContent =
        new Date().getFullYear()
    document.getElementById('footerYear').textContent = new Date().getFullYear()
    // Bind the port 5000 for frontend visibility
    console.log('Programme FUTUR platform initialized on port 5000')
})

// Initialize all event listeners
function initializeEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch)
    matriculeInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch()
        }
    })

    // Admin functionality
    adminBtn.addEventListener('click', showAdminModal)
    document
        .getElementById('adminLoginBtn')
        .addEventListener('click', handleAdminLogin)
    document
        .getElementById('adminCancelBtn')
        .addEventListener('click', hideAdminModal)
    document.getElementById('logoutBtn').addEventListener('click', handleLogout)
    document
        .getElementById('logoutBtn2')
        .addEventListener('click', handleLogout)
    document
        .getElementById('addStudentForm')
        .addEventListener('submit', handleAddStudent)

    // Admin tabs
    document
        .getElementById('addStudentTab')
        .addEventListener('click', showAddStudentTab)
    document
        .getElementById('viewStudentsTab')
        .addEventListener('click', showViewStudentsTab)

    // Search in students list
    document
        .getElementById('searchStudents')
        .addEventListener('input', filterStudentsList)

    // Download certificate functionality
    document
        .getElementById('downloadCertBtn')
        .addEventListener('click', downloadCertificate)

    // Close modal when clicking outside
    adminModal.addEventListener('click', function (e) {
        if (e.target === adminModal) {
            hideAdminModal()
        }
    })
}

// Handle student search
function handleSearch() {
    const matricule = matriculeInput.value.trim().toUpperCase()

    console.log('Recherche pour matricule:', matricule)
    console.log("Nombre d'étudiants dans la base:", students.length)

    // Clear previous error
    hideError()
    hideStudentCard()

    // Validate input
    if (!matricule) {
        showError('Veuillez saisir un numéro matricule.')
        return
    }

    // Search for student
    const student = findStudentByMatricule(matricule)
    console.log('Étudiant trouvé:', student)

    if (student) {
        displayStudentCard(student)
    } else {
        showError(
            "Aucun étudiant trouvé avec ce numéro matricule. Formats acceptés : 'PF-NATI-2025-1002' ou 'NATI-2025-1002'"
        )
    }
}

// Find student by matricule
function findStudentByMatricule(matricule) {
    // Try exact match first
    let student = students.find(student => student.matricule === matricule)

    // If no exact match and matricule doesn't start with PF-, try adding PF- prefix
    if (!student && !matricule.startsWith('PF-')) {
        const fullMatricule = `PF-${matricule}`
        student = students.find(student => student.matricule === fullMatricule)
        console.log('Recherche avec préfixe PF-:', fullMatricule)
    }

    return student
}

// Display student certificate card
function displayStudentCard(student) {
    // Store current student for download functionality
    currentStudent = student

    // Update student information
    document.getElementById('studentPhoto').src = student.photo
    document.getElementById('studentPhoto').alt = `Photo de ${student.name}`
    document.getElementById('studentName').textContent = student.name
    document.getElementById('studentMatricule').textContent = student.matricule
    document.getElementById('studentFiliere').textContent = student.filieres
        ? student.filieres.join(', ')
        : ''

    // Generate certificate message
    const certificateMessage = `Nous certifions que ${
        student.name
    } a suivi avec succès la formation en ${
        student.filieres ? student.filieres.join(', ') : ''
    } dans le cadre du Programme FUTUR.`
    document.getElementById('certificateMessage').textContent =
        certificateMessage

    // Show the card with animation
    studentCard.classList.remove('hidden')
    studentCard.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Add error handling for missing images
    const photoImg = document.getElementById('studentPhoto')
    photoImg.onerror = function () {
        this.src =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEMxMDEuNTM5IDgwIDEyMCA2MS41MzkgMTIwIDQwQzEyMCAxOC40NjEgMTAxLjUzOSAwIDgwIDBDNTguNDYxIDAgNDAgMTguNDYxIDQwIDQwQzQwIDYxLjUzOSA1OC40NjEgODAgODBaIiBmaWxsPSIjRDFEOURCIi8+CjxwYXRoIGQ9Ik00MCA5MC42NjY3QzQwIDg2LjI0NzEgNDMuNTgyIDgyLjY2NjcgNDggODIuNjY2N0gxMTJDMTE2LjQxOCA4Mi42NjY3IDEyMCA4Ni4yNDcxIDEyMCA5MC42NjY3VjE2MEg0MFY5MC42NjY3WiIgZmlsbD0iI0QxRDlEQiIvPgo8L3N2Zz4K'
        this.alt = 'Photo non disponible'
    }
}

// Hide student card
function hideStudentCard() {
    studentCard.classList.add('hidden')
    currentStudent = null
}

// Show error message
function showError(message) {
    const errorDiv = errorMessage.querySelector('p')
    errorDiv.textContent = message
    errorMessage.classList.remove('hidden')
}

// Hide error message
function hideError() {
    errorMessage.classList.add('hidden')
}

// Admin functionality
function showAdminModal() {
    // Clear form fields
    document.getElementById('adminUsername').value = ''
    document.getElementById('adminPassword').value = ''
    document.getElementById('adminError').classList.add('hidden')

    adminModal.classList.remove('hidden')
    document.getElementById('adminUsername').focus()
}

function hideAdminModal() {
    adminModal.classList.add('hidden')
}

function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim()
    const password = document.getElementById('adminPassword').value
    const adminError = document.getElementById('adminError')

    // Validate credentials
    if (
        username === adminCredentials.username &&
        password === adminCredentials.password
    ) {
        isAdminLoggedIn = true
        hideAdminModal()
        showAdminPanel()
        hideStudentCard()
        searchSection.classList.add('hidden')
        adminBtn.classList.add('hidden')
    } else {
        adminError.textContent = "Nom d'utilisateur ou mot de passe incorrect."
        adminError.classList.remove('hidden')
    }
}

function showAdminPanel() {
    adminPanel.classList.remove('hidden')
    // Clear form
    document.getElementById('addStudentForm').reset()
    document.getElementById('addStudentMessage').classList.add('hidden')
    // Show add student tab by default
    showAddStudentTab()
    displayAllStudents()
}

function handleLogout() {
    isAdminLoggedIn = false
    adminPanel.classList.add('hidden')
    searchSection.classList.remove('hidden')
    adminBtn.classList.remove('hidden')
    hideStudentCard()
}

function handleAddStudent(e) {
    e.preventDefault()

    if (!isAdminLoggedIn) {
        return
    }

    // Get form data
    const firstName = document.getElementById('studentFirstName').value.trim()
    const lastName = document.getElementById('studentLastName').value.trim()
    const matricule = document
        .getElementById('studentMatriculeNew')
        .value.trim()
        .toUpperCase()
    // Récupérer les filières cochées
    const filieres = Array.from(
        document.querySelectorAll('input[name="studentFilieres"]:checked')
    ).map(cb => cb.value)
    const photoUrl = document.getElementById('studentPhotoUrl').value.trim()

    const messageDiv = document.getElementById('addStudentMessage')

    // Validate matricule format
    if (!matricule.match(/^PF-NATI-2025-\d{4}$/)) {
        showAddStudentMessage(
            'Format de matricule invalide. Utilisez le format: PF-NATI-2025-XXXX',
            'error'
        )
        return
    }

    // Check if matricule already exists
    if (findStudentByMatricule(matricule)) {
        showAddStudentMessage(
            'Ce numéro matricule existe déjà dans la base de données.',
            'error'
        )
        return
    }

    // Create new student object
    const newStudent = {
        id: students.length + 1,
        matricule: matricule,
        name: `${lastName} ${firstName}`,
        filieres: filieres,
        photo: photoUrl,
    }

    // Add to students array
    students.push(newStudent)

    // Show success message
    showAddStudentMessage(
        `Étudiant ${newStudent.name} ajouté avec succès!`,
        'success'
    )

    // Reset form
    document.getElementById('addStudentForm').reset()

    console.log('New student added:', newStudent)
    console.log('Total students:', students.length)
}

function showAddStudentMessage(message, type) {
    const messageDiv = document.getElementById('addStudentMessage')
    messageDiv.textContent = message
    messageDiv.className = `p-3 rounded-lg text-center ${
        type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
    }`
    messageDiv.classList.remove('hidden')

    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden')
    }, 5000)
}

// Utility function to get environment variables with fallback
function getEnvVar(name, fallback) {
    return (
        (typeof process !== 'undefined' && process.env && process.env[name]) ||
        fallback
    )
}

// Add some security measures
function sanitizeInput(input) {
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
}

// Prevent XSS attacks by sanitizing user inputs
function sanitizeFormData(formData) {
    const sanitized = {}
    for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
            sanitized[key] = sanitizeInput(formData[key])
        }
    }
    return sanitized
}

// Add loading states for better UX
function showLoading(element) {
    element.disabled = true
    element.innerHTML = '<span class="animate-spin">⟳</span> Chargement...'
}

function hideLoading(element, originalText) {
    element.disabled = false
    element.innerHTML = originalText
}

// Initialize offline functionality
function initializeOfflineSupport() {
    // Store students data in localStorage for offline access
    localStorage.setItem('programmeFuturStudents', JSON.stringify(students))

    // Check if online/offline
    window.addEventListener('online', function () {
        console.log('Application is online')
    })

    window.addEventListener('offline', function () {
        console.log('Application is offline - using cached data')
    })
}

// Admin tabs functionality
function showAddStudentTab() {
    // Update tab styles
    document.getElementById('addStudentTab').className =
        'px-6 py-3 text-custom-blue border-b-2 border-custom-cyan font-semibold'
    document.getElementById('viewStudentsTab').className =
        'px-6 py-3 text-gray-600 hover:text-custom-blue'

    // Show/hide sections
    document.getElementById('addStudentSection').classList.remove('hidden')
    document.getElementById('viewStudentsSection').classList.add('hidden')
}

function showViewStudentsTab() {
    // Update tab styles
    document.getElementById('addStudentTab').className =
        'px-6 py-3 text-gray-600 hover:text-custom-blue'
    document.getElementById('viewStudentsTab').className =
        'px-6 py-3 text-custom-blue border-b-2 border-custom-cyan font-semibold'

    // Show/hide sections
    document.getElementById('addStudentSection').classList.add('hidden')
    document.getElementById('viewStudentsSection').classList.remove('hidden')

    // Update students list
    displayAllStudents()
}

function displayAllStudents() {
    const tableBody = document.getElementById('studentsTableBody')
    const studentCount = document.getElementById('studentCount')

    studentCount.textContent = students.length

    tableBody.innerHTML = ''

    students.forEach(student => {
        const row = document.createElement('tr')
        row.className = 'hover:bg-gray-50'

        row.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">
                <img src="${student.photo}" alt="Photo ${student.name}" 
                     class="w-12 h-12 rounded-full object-cover"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEMzMC4wNzUxIDI0IDM1IDIwLjQxODMgMzUgMTZDMzUgMTEuNTgxNyAzMC4wNzUxIDggMjQgOEMxNy45MjQ5IDggMTMgMTEuNTgxNyAxMyAxNkMxMyAyMC40MTgzIDE3LjkyNDkgMjQgMjQgMjRaIiBmaWxsPSIjRDFEOURCIi8+CjxwYXRoIGQ9Ik0xMyAyOEMxMyAyNi44OTU0IDEzLjg5NTQgMjYgMTUgMjZIMzNDMzQuMTA0NiAyNiAzNSAyNi44OTU0IDM1IDI4VjQwSDEzVjI4WiIgZmlsbD0iI0QxRDlEQiIvPgo8L3N2Zz4K';">
            </td>
            <td class="border border-gray-300 px-4 py-2 font-medium">${
                student.name
            }</td>
            <td class="border border-gray-300 px-4 py-2 text-sm text-gray-600">${
                student.matricule
            }</td>
            <td class="border border-gray-300 px-4 py-2 text-sm">${
                student.filieres ? student.filieres.join(', ') : ''
            }</td>
        `

        tableBody.appendChild(row)
    })
}

function filterStudentsList() {
    const searchTerm = document
        .getElementById('searchStudents')
        .value.toLowerCase()
    const tableBody = document.getElementById('studentsTableBody')
    const rows = tableBody.getElementsByTagName('tr')

    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase()
        const matricule = row.cells[2].textContent.toLowerCase()

        if (name.includes(searchTerm) || matricule.includes(searchTerm)) {
            row.style.display = ''
        } else {
            row.style.display = 'none'
        }
    })
}

// Download certificate functionality
function downloadCertificate() {
    if (!currentStudent) {
        alert(
            "Aucun certificat à télécharger. Veuillez d'abord rechercher un étudiant."
        )
        return
    }

    // Create certificate content
    const certificateHTML = generateCertificateHTML(currentStudent)

    // Create a temporary element to generate PDF
    const printWindow = window.open('', '_blank')
    printWindow.document.write(certificateHTML)
    printWindow.document.close()

    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print()
        printWindow.close()
    }, 500)
}

function generateCertificateHTML(student) {
    const currentYear = new Date().getFullYear()
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: 'long',
        year: 'numeric',
        month: 'long',
    })

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificat - ${student.name}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Montserrat', sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #0b1d3a 0%, #1e3a5f 100%);
                min-height: 100vh;
            }
            
            .certificate {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                overflow: hidden;
            }
            
            .header {
                background: #0b1d3a;
                color: white;
                padding: 30px;
                text-align: center;
                border-bottom: 5px solid #00ffff;
            }
            
            .logo {
                width: 60px;
                height: 60px;
                background: #00ffff;
                border-radius: 10px;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0b1d3a;
                font-size: 24px;
                font-weight: bold;
            }
            
            .certificate-title {
                font-size: 36px;
                font-weight: 700;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            
            .subtitle {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .content {
                padding: 50px 40px;
                text-align: center;
            }
            
            .student-photo {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 5px solid #00ffff;
                margin: 0 auto 30px;
                display: block;
            }
            
            .student-name {
                font-size: 32px;
                font-weight: 700;
                color: #0b1d3a;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .student-info {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
            }
            
            .certificate-text {
                font-size: 18px;
                line-height: 1.6;
                color: #333;
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-left: 4px solid #00ffff;
                border-radius: 5px;
            }
            
            .signature-section {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
                padding-top: 30px;
                border-top: 2px solid #eee;
            }
            
            .signature {
                text-align: center;
                flex: 1;
            }
            
            .signature-line {
                width: 150px;
                height: 1px;
                background: #333;
                margin: 40px auto 10px;
            }
            
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #eee;
            }
            
            @media print {
                body { background: white; padding: 0; }
                .certificate { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">
                <div class="logo">FC</div>
                <h1 class="certificate-title">CERTIFICAT DE FORMATION</h1>
                <p class="subtitle">Programme FUTUR - FuturCerty</p>
            </div>
            
            <div class="content">
                <img src="${student.photo}" alt="Photo de ${
        student.name
    }" class="student-photo" 
                     onerror="this.style.display='none'">
                
                <h2 class="student-name">${student.name}</h2>
                
                <div class="student-info">
                    <strong>Matricule:</strong> ${student.matricule}<br>
                    <strong>Filière:</strong> ${
                        student.filieres ? student.filieres.join(', ') : ''
                    }
                </div>
                
                <div class="certificate-text">
                    Nous certifions que <strong>${
                        student.name
                    }</strong> a suivi avec succès la formation en 
                    <strong>${
                        student.filieres ? student.filieres.join(', ') : ''
                    }</strong> dans le cadre du Programme FUTUR et a satisfait à toutes 
                    les exigences requises pour l'obtention de cette certification.
                </div>
                
                <div class="signature-section">
                    <div class="signature">
                        <div class="signature-line"></div>
                        <p><strong>Directeur Pédagogique</strong><br>Programme FUTUR</p>
                    </div>
                    <div class="signature">
                        <div class="signature-line"></div>
                        <p><strong>Coordinateur</strong><br>FuturCerty</p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Certificat authentifié par le Programme FUTUR - ${currentYear}</p>
                <p>Délivré le ${currentDate} | Numéro de vérification: ${
        student.matricule
    }</p>
                <p>Ce certificat peut être vérifié sur notre plateforme FuturCerty</p>
            </div>
        </div>
    </body>
    </html>
    `
}

// Call offline support initialization
initializeOfflineSupport()
