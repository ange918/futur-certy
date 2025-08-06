// Global variables
let isAdminLoggedIn = false
let currentStudent = null

// DOM elements (seront initialisés après le chargement du DOM)
let searchBtn, matriculeInput, errorMessage, studentCard, adminBtn, adminModal, adminPanel, searchSection

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM chargé, initialisation...')
    console.log('Nombre d\'étudiants disponibles:', students.length)
    console.log('Premier étudiant:', students[0])
    
    // Initialiser les éléments DOM
    searchBtn = document.getElementById('searchBtn')
    matriculeInput = document.getElementById('matriculeInput')
    errorMessage = document.getElementById('errorMessage')
    studentCard = document.getElementById('studentCard')
    adminBtn = document.getElementById('adminBtn')
    adminModal = document.getElementById('adminModal')
    adminPanel = document.getElementById('adminPanel')
    searchSection = document.getElementById('searchSection')
    
    // Vérifier que les éléments DOM existent
    console.log('searchBtn:', searchBtn)
    console.log('matriculeInput:', matriculeInput)
    console.log('studentCard:', studentCard)
    
    initializeEventListeners()
    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear()
    document.getElementById('footerYear').textContent = new Date().getFullYear()
    console.log('Programme FUTUR platform initialized')
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
    document.getElementById('adminLoginBtn').addEventListener('click', handleAdminLogin)
    document.getElementById('adminCancelBtn').addEventListener('click', hideAdminModal)
    document.getElementById('logoutBtn').addEventListener('click', handleLogout)
    document.getElementById('logoutBtn2').addEventListener('click', handleLogout)
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent)

    // Admin tabs
    document.getElementById('addStudentTab').addEventListener('click', showAddStudentTab)
    document.getElementById('viewStudentsTab').addEventListener('click', showViewStudentsTab)

    // Search in students list
    document.getElementById('searchStudents').addEventListener('input', filterStudentsList)



    // Close modal when clicking outside
    adminModal.addEventListener('click', function (e) {
        if (e.target === adminModal) {
            hideAdminModal()
        }
    })
}

function handleSearch() {
    const matricule = matriculeInput.value.trim().toUpperCase()

    // Validation du format
    const regex = /^(?:PF-)?(?:NATI|GDM|OUGDM)-2025-\d{4}$/
    if (!regex.test(matricule)) {
        alert("Format de matricule invalide.\nExemples valides : PF-NATI-2025-0001, GDM-2025-1001, OUGDM-2025-1234")
        return
    }

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
        showError("Aucun étudiant trouvé avec ce numéro matricule. Formats acceptés : 'PF-NATI-2025-1002', 'GDM-2025-1001', 'NATI-2025-1002'")
    }
}

// Find student by matricule
function findStudentByMatricule(matricule) {
    console.log('Recherche pour matricule:', matricule)
    console.log('Nombre total d\'étudiants:', students.length)
    
    // Try exact match first
    let student = students.find(student => student.matricule === matricule)
    console.log('Résultat recherche exacte:', student ? 'Trouvé' : 'Non trouvé')

    // If no exact match and matricule doesn't start with PF-, try adding PF- prefix
    if (!student && !matricule.startsWith('PF-')) {
        const fullMatricule = `PF-${matricule}`
        student = students.find(student => student.matricule === fullMatricule)
        console.log('Recherche avec préfixe PF-:', fullMatricule, student ? 'Trouvé' : 'Non trouvé')
    }

    // If still no match and matricule starts with PF-, try removing PF- prefix
    if (!student && matricule.startsWith('PF-')) {
        const shortMatricule = matricule.substring(3) // Remove "PF-"
        student = students.find(student => student.matricule === shortMatricule)
        console.log('Recherche sans préfixe PF-:', shortMatricule, student ? 'Trouvé' : 'Non trouvé')
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
    document.getElementById('studentFiliere').textContent = student.filieres ? student.filieres.join(', ') : ''

    // Generate certificate message
    const certificateMessage = `Nous certifions que l'étudiant(e) ${student.name} a suivi avec succès la formation en ${student.filieres ? student.filieres.join(', ') : ''} dispensée dans le cadre du Programme FUTUR.

Cette attestation confirme sa participation effective, l'acquisition des compétences fondamentales prévues par le programme, ainsi que la validation des évaluations finales.
Elle est délivrée conformément aux standards de qualité et aux exigences pédagogiques du Programme FUTUR.



🔒 Authenticité vérifiée par la plateforme officielle

Ce certificat est authentique et vérifié électroniquement via la plateforme de certification du Programme FUTUR.
Chaque certificat émis est traçable, infalsifiable et consultable en ligne à l’aide de son numéro de matricule unique.

Toute tentative de falsification ou de reproduction non autorisée est formellement interdite et expose à des sanctions.`
    document.getElementById('certificateMessage').innerHTML = certificateMessage.replace(/\n/g, '<br>')

    // Show the card with animation
    studentCard.classList.remove('hidden')
    studentCard.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Add error handling for missing images
    const photoImg = document.getElementById('studentPhoto')
    photoImg.onerror = function () {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEMxMDEuNTM5IDgwIDEyMCA2MS41MzkgMTIwIDQwQzEyMCAxOC40NjEgMTAxLjUzOSAwIDgwIDBDNTguNDYxIDAgNDAgMTguNDYxIDQwIDQwQzQwIDYxLjUzOSA1OC40NjEgODAgODBaIiBmaWxsPSIjRDFEOURCIi8+CjxwYXRoIGQ9Ik00MCA5MC42NjY3QzQwIDg2LjI0NzEgNDMuNTgyIDgyLjY2NjcgNDggODIuNjY2N0gxMTJDMTE2LjQxOCA4Mi42NjY3IDEyMCA4Ni4yNDcxIDEyMCA5MC42NjY3VjE2MEg0MFY5MC42NjY3WiIgZmlsbD0iI0QxRDlEQiIvPgo8L3N2Zz4K'
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

    if (username === adminCredentials.username && password === adminCredentials.password) {
        isAdminLoggedIn = true
        hideAdminModal()
        showAdminPanel()
    } else {
        adminError.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.'
        adminError.classList.remove('hidden')
    }
}

function showAdminPanel() {
    searchSection.classList.add('hidden')
    adminPanel.classList.remove('hidden')
    displayAllStudents()
}

function handleLogout() {
    isAdminLoggedIn = false
    adminPanel.classList.add('hidden')
    searchSection.classList.remove('hidden')
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
    const matricule = document.getElementById('studentMatriculeNew').value.trim().toUpperCase()
    const filieres = Array.from(document.querySelectorAll('input[name="studentFilieres"]:checked')).map(cb => cb.value)
    const photoUrl = document.getElementById('studentPhotoUrl').value.trim()

    // Validate matricule format
    if (!matricule.match(/^(PF-)?(NATI|GDM)-2025-\d{4}$/)) {
        showAddStudentMessage('Format de matricule invalide. Utilisez le format: PF-GDM-2025-1234, GDM-2025-1234, PF-NATI-2025-1234, ou NATI-2025-1234', 'error')
        return
    }

    // Check if matricule already exists
    if (findStudentByMatricule(matricule)) {
        showAddStudentMessage('Ce numéro matricule existe déjà dans la base de données.', 'error')
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
    showAddStudentMessage(`Étudiant ${newStudent.name} ajouté avec succès!`, 'success')

    // Reset form
    document.getElementById('addStudentForm').reset()

    console.log('New student added:', newStudent)
    console.log('Total students:', students.length)
}

function showAddStudentMessage(message, type) {
    const messageDiv = document.getElementById('addStudentMessage')
    messageDiv.textContent = message
    messageDiv.className = `p-3 rounded-lg text-center ${
        type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
    }`
    messageDiv.classList.remove('hidden')

    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden')
    }, 5000)
}

function showAddStudentTab() {
    document.getElementById('addStudentTab').classList.add('bg-custom-cyan', 'text-custom-blue')
    document.getElementById('viewStudentsTab').classList.remove('bg-custom-cyan', 'text-custom-blue')
    document.getElementById('addStudentSection').classList.remove('hidden')
    document.getElementById('viewStudentsSection').classList.add('hidden')
}

function showViewStudentsTab() {
    document.getElementById('viewStudentsTab').classList.add('bg-custom-cyan', 'text-custom-blue')
    document.getElementById('addStudentTab').classList.remove('bg-custom-cyan', 'text-custom-blue')
    document.getElementById('viewStudentsSection').classList.remove('hidden')
    document.getElementById('addStudentSection').classList.add('hidden')
    displayAllStudents()
}

function displayAllStudents() {
    const tableBody = document.getElementById('studentsTableBody')
    tableBody.innerHTML = ''

    students.forEach((student, index) => {
        const row = document.createElement('tr')
        row.className = 'border-b border-gray-200 hover:bg-gray-50'
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${student.name}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${student.matricule}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${student.filieres.join(', ')}</td>
        `
        tableBody.appendChild(row)
    })
}

function filterStudentsList() {
    const searchTerm = document.getElementById('searchStudents').value.toLowerCase()
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

 