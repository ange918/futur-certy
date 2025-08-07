// Variables globales
let isAdminLoggedIn = false;
let currentStudent = null;

// Éléments DOM (initialisés après chargement du DOM)
let searchBtn, matriculeInput, errorMessage, studentCard, adminBtn, adminModal, adminPanel, searchSection;

// Initialisation de l’application au chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM chargé, initialisation...');
    console.log('Nombre d\'étudiants disponibles:', students.length);
    console.log('Premier étudiant:', students[0]);

    // Initialiser les éléments DOM
    searchBtn = document.getElementById('searchBtn');
    matriculeInput = document.getElementById('matriculeInput');
    errorMessage = document.getElementById('errorMessage');
    studentCard = document.getElementById('studentCard');
    adminBtn = document.getElementById('adminBtn');
    adminModal = document.getElementById('adminModal');
    adminPanel = document.getElementById('adminPanel');
    searchSection = document.getElementById('searchSection');

    // Vérifier que les éléments DOM existent
    console.log('searchBtn:', searchBtn);
    console.log('matriculeInput:', matriculeInput);
    console.log('studentCard:', studentCard);

    initializeEventListeners();

    // Mettre à jour l'année courante dans le footer et autre
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('footerYear').textContent = new Date().getFullYear();
    console.log('Programme FUTUR platform initialized');
});

// Initialisation des écouteurs d’événements
function initializeEventListeners() {
    // Recherche
    searchBtn.addEventListener('click', handleSearch);
    matriculeInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Fonctionnalité admin
    adminBtn.addEventListener('click', showAdminModal);
    document.getElementById('adminLoginBtn').addEventListener('click', handleAdminLogin);
    document.getElementById('adminCancelBtn').addEventListener('click', hideAdminModal);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('logoutBtn2').addEventListener('click', handleLogout);
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);

    // Onglets admin
    document.getElementById('addStudentTab').addEventListener('click', showAddStudentTab);
    document.getElementById('viewStudentsTab').addEventListener('click', showViewStudentsTab);

    // Filtrage étudiants dans la liste admin
    document.getElementById('searchStudents').addEventListener('input', filterStudentsList);

    // Télécharger certificat
    document.getElementById('downloadCertBtn').addEventListener('click', downloadCertificate);

    // Fermer la modal admin en cliquant en dehors
    adminModal.addEventListener('click', function (e) {
        if (e.target === adminModal) {
            hideAdminModal();
        }
    });
}

// Gestion recherche étudiant
function handleSearch() {
    const matricule = matriculeInput.value.trim().toUpperCase();

    // Validation format matricule
    const regex = /^(?:PF-)?(?:NATI|GDM|OUGDM)-2025-\d{4}$/;
    if (!regex.test(matricule)) {
        alert("Format de matricule invalide.\nExemples valides : PF-NATI-2025-0001, GDM-2025-1001, OUGDM-2025-1234");
        return;
    }

    console.log('Recherche pour matricule:', matricule);
    console.log("Nombre d'étudiants dans la base:", students.length);

    hideError();
    hideStudentCard();

    if (!matricule) {
        showError('Veuillez saisir un numéro matricule.');
        return;
    }

    const student = findStudentByMatricule(matricule);
    console.log('Étudiant trouvé:', student);

    if (student) {
        displayStudentCard(student);
    } else {
        showError("Aucun étudiant trouvé avec ce numéro matricule. Formats acceptés : 'PF-NATI-2025-1002', 'GDM-2025-1001', 'NATI-2025-1002'");
    }
}

// Recherche un étudiant par matricule précis ou avec PF- ajouté/enlevé
function findStudentByMatricule(matricule) {
    console.log('Recherche pour matricule:', matricule);
    console.log('Nombre total d\'étudiants:', students.length);

    let student = students.find(s => s.matricule === matricule);
    console.log('Résultat recherche exacte:', student ? 'Trouvé' : 'Non trouvé');

    if (!student && !matricule.startsWith('PF-')) {
        student = students.find(s => s.matricule === `PF-${matricule}`);
        console.log('Recherche avec préfixe PF-:', `PF-${matricule}`, student ? 'Trouvé' : 'Non trouvé');
    }

    if (!student && matricule.startsWith('PF-')) {
        const shortMatricule = matricule.substring(3);
        student = students.find(s => s.matricule === shortMatricule);
        console.log('Recherche sans préfixe PF-:', shortMatricule, student ? 'Trouvé' : 'Non trouvé');
    }

    return student;
}

// Affichage carte étudiant avec certificat et mise en forme colorée
function displayStudentCard(student) {
    currentStudent = student;

    document.getElementById('studentPhoto').src = student.photo;
    document.getElementById('studentPhoto').alt = `Photo de ${student.name}`;
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentMatricule').textContent = student.matricule;
    document.getElementById('studentFiliere').textContent = student.filieres ? student.filieres.join(', ') : '';

    const certificateMessage = `
        Nous certifions que l'étudiant(e) <strong>${student.name}</strong> a suivi avec succès la formation en <strong>${student.filieres ? student.filieres.join(', ') : ''}</strong> dispensée dans le cadre du Programme FUTUR.<br><br>
                      <strong style="color:green;">🔒 Authenticité vérifiée par la plateforme officielle</strong>

        Cette attestation confirme sa participation effective, l'acquisition des compétences fondamentales prévues par le programme, ainsi que la validation des évaluations finales.<br>
        Elle est délivrée conformément aux standards de qualité et aux exigences pédagogiques du Programme FUTUR.

       
        <strong style="color:red;">
        Toute tentative de falsification ou de reproduction non autorisée est formellement interdite et expose à des sanctions.
        </strong>
    `;

    document.getElementById('certificateMessage').innerHTML = certificateMessage;

    studentCard.classList.remove('hidden');
    studentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const photoImg = document.getElementById('studentPhoto');
    photoImg.onerror = function () {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEMxMDEuNTM5IDgwIDEyMCA2MS41MzkgMTIwIDQwQzEyMCAxOC40NjEgMTAxLjUzOSAwIDgwIDBDNTguNDYxIDAgNDAgMTguNDYxIDQwIDQwQzQwIDYxLjUzOSA1OC40NjEgODAgODBaIiBmaWxsPSIjRDFEOURCIi8+CjxwYXRoIGQ9Ik00MCA5MC42NjY3QzQwIDg2LjI0NzEgNDMuNTgyIDgyLjY2NjcgNDggODIuNjY2N0gxMTJDMTE2LjQxOCA4Mi42NjY3IDEyMCA4Ni4yNDcxIDEyMCA5MC42NjY3VjE2MEg0MFY5MC42NjY3WiIgZmlsbD0iI0QxRDlEQiIvPgo8L3N2Zz4K';
        this.alt = 'Photo non disponible';
    };
}

function hideStudentCard() {
    studentCard.classList.add('hidden');
    currentStudent = null;
}

function showError(message) {
    const errorDiv = errorMessage.querySelector('p');
    errorDiv.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Fonctionnalités admin
function showAdminModal() {
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminError').classList.add('hidden');
    adminModal.classList.remove('hidden');
    document.getElementById('adminUsername').focus();
}

function hideAdminModal() {
    adminModal.classList.add('hidden');
}

function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const adminError = document.getElementById('adminError');

    if (username === adminCredentials.username && password === adminCredentials.password) {
        isAdminLoggedIn = true;
        hideAdminModal();
        showAdminPanel();
    } else {
        adminError.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
        adminError.classList.remove('hidden');
    }
}

function showAdminPanel() {
    searchSection.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    displayAllStudents();
}

function handleLogout() {
    isAdminLoggedIn = false;
    adminPanel.classList.add('hidden');
    searchSection.classList.remove('hidden');
    hideStudentCard();
}

function handleAddStudent(e) {
    e.preventDefault();

    if (!isAdminLoggedIn) return;

    const firstName = document.getElementById('studentFirstName').value.trim();
    const lastName = document.getElementById('studentLastName').value.trim();
    const matricule = document.getElementById('studentMatriculeNew').value.trim().toUpperCase();
    const filieres = Array.from(document.querySelectorAll('input[name="studentFilieres"]:checked')).map(cb => cb.value);
    const photoUrl = document.getElementById('studentPhotoUrl').value.trim();

    if (!matricule.match(/^(PF-)?(NATI|GDM)-2025-\d{4}$/)) {
        showAddStudentMessage('Format de matricule invalide. Utilisez le format: PF-GDM-2025-1234, GDM-2025-1234, PF-NATI-2025-1234, ou NATI-2025-1234', 'error');
        return;
    }

    if (findStudentByMatricule(matricule)) {
        showAddStudentMessage('Ce numéro matricule existe déjà dans la base de données.', 'error');
        return;
    }

    const newStudent = {
        id: students.length + 1,
        matricule: matricule,
        name: `${lastName} ${firstName}`,
        filieres: filieres,
        photo: photoUrl,
    };

    students.push(newStudent);

    showAddStudentMessage(`Étudiant ${newStudent.name} ajouté avec succès!`, 'success');
    document.getElementById('addStudentForm').reset();

    console.log('New student added:', newStudent);
    console.log('Total students:', students.length);
}

function showAddStudentMessage(message, type) {
    const messageDiv = document.getElementById('addStudentMessage');
    messageDiv.textContent = message;
    messageDiv.className = `p-3 rounded-lg text-center ${
        type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
    }`;
    messageDiv.classList.remove('hidden');

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

function showAddStudentTab() {
    document.getElementById('addStudentTab').classList.add('bg-custom-cyan', 'text-custom-blue');
    document.getElementById('viewStudentsTab').classList.remove('bg-custom-cyan', 'text-custom-blue');
    document.getElementById('addStudentSection').classList.remove('hidden');
    document.getElementById('viewStudentsSection').classList.add('hidden');
}

function showViewStudentsTab() {
    document.getElementById('viewStudentsTab').classList.add('bg-custom-cyan', 'text-custom-blue');
    document.getElementById('addStudentTab').classList.remove('bg-custom-cyan', 'text-custom-blue');
    document.getElementById('viewStudentsSection').classList.remove('hidden');
    document.getElementById('addStudentSection').classList.add('hidden');
    displayAllStudents();
}

function displayAllStudents() {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${student.name}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${student.matricule}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${student.filieres.join(', ')}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterStudentsList() {
    const searchTerm = document.getElementById('searchStudents').value.toLowerCase();
    const tableBody = document.getElementById('studentsTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const matricule = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchTerm) || matricule.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function downloadCertificate() {
    if (!currentStudent) {
        alert("Aucun certificat à télécharger. Veuillez d'abord rechercher un étudiant.");
        return;
    }

    const certificateHTML = generateCertificateHTML(currentStudent);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(certificateHTML);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}



// Fonction générant le contenu HTML complet du certificat avec styles pour le texte mis en forme selon votre demande
function generateCertificateHTML(student) {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: 'long',
        year: 'numeric',
        month: 'long',
    });

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Certificat - ${student.name}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .certificate { max-width: 800px; margin: 0 auto; background: white; border: 2px solid #333; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .content { text-align: center; }
            .student-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 20px auto; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">
                <h1>CERTIFICAT DE FORMATION</h1>
                <p>Programme FUTUR</p>
            </div>
            <div class="content">
                <img src="${student.photo}" alt="Photo de ${student.name}" class="student-photo" />
                <h2>${student.name}</h2>
                <p><strong>Matricule:</strong> ${student.matricule}</p>
                <p><strong>Filière:</strong> ${student.filieres.join(', ')}</p>
                <p>
                    Nous certifions que l'étudiant(e) <strong>${student.name}</strong> a suivi avec succès la formation en <strong>${student.filieres.join(', ')}</strong> dispensée dans le cadre du Programme FUTUR.<br><br>

                    Cette attestation confirme sa participation effective, l’acquisition des compétences fondamentales prévues par le programme, ainsi que la validation des évaluations finales.<br>
                    Elle est délivrée conformément aux standards de qualité et aux exigences pédagogiques du Programme FUTUR.<br><br>

                    <strong style="color:green;">🔒 Authenticité vérifiée par la plateforme officielle</strong><br><br>

                    <strong style="color:red;">
                    Toute tentative de falsification ou de reproduction non autorisée est formellement interdite et expose à des sanctions.
                    </strong>
                </p>
            </div>
            <div class="footer">
                <p>Certificat authentifié par le Programme FUTUR - ${currentYear}</p>
                <p>Délivré le ${currentDate}</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
