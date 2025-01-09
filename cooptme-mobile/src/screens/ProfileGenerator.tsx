import _ from 'lodash';

// Types de données pour un contact
export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  function: string;
  meetingPlace: string;
  company: string;
  email: string;
  photo: string;
  category: string;
  gender: 'male' | 'female';
  photoId: number;
};

// Définition des catégories
export type CategoryTitle =
  | 'IT'
  | 'Marketing'
  | 'RH'
  | 'Finance'
  | 'Communication'
  | 'Students'
  | 'Project Manager'
  | 'Product Owner'
  | 'Customer Care Manager'
  | 'Other';

// Définitions des postes par catégorie
type JobTitlesType = {
  [K in CategoryTitle]: string[];
};

// Liste des catégories avec pondération
export const categories: Array<{ id: string; title: CategoryTitle; count: number }> = [
  { id: '1', title: 'IT', count: 145 },
  { id: '2', title: 'Marketing', count: 89 },
  { id: '3', title: 'RH', count: 67 },
  { id: '4', title: 'Finance', count: 54 },
  { id: '5', title: 'Communication', count: 78 },
  { id: '6', title: 'Students', count: 234 },
  { id: '7', title: 'Project Manager', count: 45 },
  { id: '8', title: 'Product Owner', count: 32 },
  { id: '9', title: 'Customer Care Manager', count: 28 },
  { id: '10', title: 'Other', count: 28 },
];

// Données factices pour les entreprises, postes et lieux
const enterprises = [
  'Tech Solutions',
  'Digital Agency',
  'StartupLab',
  'Innovation Corp',
  'Data Analytics',
  'Web Services',
  'Mobile Apps',
  'Cloud Computing',
  'AI Research',
  'Software House',
];

const jobTitles: JobTitlesType = {
  IT: ['Développeur Full Stack', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer'],
  Marketing: ['Marketing Manager', 'SEO Specialist', 'Content Manager', 'Brand Manager'],
  RH: ['HR Manager', 'Recruitment Coordinator', 'Training Manager', 'HR Director'],
  Finance: ['Financial Analyst', 'Account Manager', 'CFO', 'Treasury Manager'],
  Communication: ['Communication Manager', 'PR Specialist', 'Content Strategist', 'Digital Specialist'],
  Students: [
    'Étudiant en Informatique',
    'Étudiant en Marketing',
    'Étudiant en Communication',
    'Étudiant en Développement Web',
  ],
  'Project Manager': ['Project Manager', 'Scrum Master', 'Agile Coach', 'Program Manager'],
  'Product Owner': ['Product Owner', 'Product Strategist', 'Product Marketing Manager'],
  'Customer Care Manager': ['Customer Care Manager', 'Customer Success Manager', 'Support Team Lead'],
  Other: ['Consultant', 'Freelance', 'Entrepreneur', 'Business Analyst', 'Quality Manager'],
};

const meetingPlaces = [
  'LinkedIn',
  'Meetup Tech',
  'Hackathon Paris',
  'Tech Conference',
  'Startup Weekend',
  'Professional Workshop',
];

const prenoms = ['Thomas', 'Marie', 'Lucas', 'Emma', 'Jules', 'Léa', 'Hugo', 'Antoine', 'Sarah'];
const noms = ['Martin', 'Bernard', 'Dubois', 'Robert', 'Richard', 'Petit', 'Durand'];
const femaleNames: string[] = ['Marie', 'Emma', 'Léa', 'Sarah', 'Julie'];

// Génération aléatoire d'un contact
export const generateContact = (): Contact => {
  const totalWeight = categories.reduce((sum, cat) => sum + cat.count, 0);
  const randomWeight = Math.random() * totalWeight;
  let weightSum = 0;
  let selectedCategory = categories[0];

  // Sélection de la catégorie en fonction de la pondération
  for (const category of categories) {
    weightSum += category.count;
    if (randomWeight <= weightSum) {
      selectedCategory = category;
      break;
    }
  }

  // Génération des données du contact
  const firstName = _.sample(prenoms) || 'John';
  const lastName = _.sample(noms) || 'Doe';
  const titles = jobTitles[selectedCategory.title];
  const randomTitle = _.sample(titles) || 'Other';
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
  const gender: 'male' | 'female' = femaleNames.includes(firstName) ? 'female' : 'male';
  const photoId = Math.floor(Math.random() * 100);

  return {
    id: Math.random().toString(36).substr(2, 9),
    firstName,
    lastName,
    function: randomTitle,
    company: _.sample(enterprises) || 'Unknown Company',
    meetingPlace: _.sample(meetingPlaces) || 'Unknown Location',
    email,
    photo: `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`,
    category: selectedCategory.title,
    gender,
    photoId,
  };
};

// Génération de plusieurs contacts
export const generateContacts = (number: number): Contact[] => {
  return Array.from({ length: number }, () => generateContact());
};

// Trie les contacts par catégorie
export const sortContactsByCategory = (contacts: Contact[]): Record<CategoryTitle, Contact[]> => {
  return contacts.reduce((acc, contact) => {
    if (!acc[contact.category]) {
      acc[contact.category] = [];
    }
    acc[contact.category].push(contact);
    return acc;
  }, {} as Record<CategoryTitle, Contact[]>);
};

// Filtre les contacts par poste
export const filterContactsByJobTitle = (contacts: Contact[], jobTitle: string): Contact[] => {
  return contacts.filter((contact) => contact.function.toLowerCase() === jobTitle.toLowerCase());
};

// Filtre les contacts par lieu de rencontre
export const filterContactsByMeetingPlace = (contacts: Contact[], meetingPlace: string): Contact[] => {
  return contacts.filter((contact) => contact.meetingPlace.toLowerCase() === meetingPlace.toLowerCase());
};
