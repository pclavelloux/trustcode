#!/usr/bin/env node

/**
 * Script pour vérifier que toutes les variables d'environnement nécessaires sont définies
 */

const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const envFilePath = path.join(process.cwd(), '.env.local');

console.log('🔍 Vérification de la configuration...\n');

// Vérifier si .env.local existe
if (!fs.existsSync(envFilePath)) {
  console.error('❌ Le fichier .env.local n\'existe pas!');
  console.log('\n💡 Créez-le avec:');
  console.log('   touch .env.local');
  console.log('   Puis ajoutez vos variables Supabase\n');
  console.log('Exemple:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...\n');
  process.exit(1);
}

// Charger les variables d'environnement
const envContent = fs.readFileSync(envFilePath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Vérifier chaque variable
let allValid = true;
const issues = [];

requiredEnvVars.forEach(varName => {
  const value = envVars[varName];
  
  if (!value) {
    allValid = false;
    issues.push(`❌ ${varName} est manquant`);
  } else if (value.includes('your_') || value.includes('xxxxx') || value === '') {
    allValid = false;
    issues.push(`⚠️  ${varName} n'est pas configuré (valeur par défaut détectée)`);
  } else {
    console.log(`✅ ${varName}`);
  }
});

console.log('');

if (!allValid) {
  console.error('❌ Configuration incomplète:\n');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('\n📖 Consultez QUICKSTART.md pour les instructions de configuration\n');
  process.exit(1);
}

console.log('✅ Toutes les variables d\'environnement Supabase sont configurées!\n');
console.log('🔐 Configuration Supabase Auth:');
console.log('   1. Allez dans votre dashboard Supabase');
console.log('   2. Authentication > Providers > GitHub');
console.log('   3. Vérifiez que GitHub OAuth est activé\n');
console.log('🚀 Vous pouvez lancer l\'application avec: npm run dev\n');
