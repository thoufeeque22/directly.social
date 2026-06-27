/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');

function runStripe(cmd, prefix) {
  const result = execSync(`stripe ${cmd}`, { encoding: 'utf-8' });
  const match = result.match(new RegExp(`${prefix}_[a-zA-Z0-9]+`));
  if (!match) throw new Error(`Could not find ID starting with ${prefix} in output: ${result}`);
  return match[0];
}

try {
  console.log('Creating Power Pass...');
  const prodPP = runStripe(`products create --name "24-Hour Pass" -d description="The Weekend Batcher. No monthly commitment."`, 'prod');
  const pricePP = runStripe(`prices create --product "${prodPP}" --unit-amount 299 --currency usd`, 'price');

  console.log('Creating Creator Pro...');
  const prodCP = runStripe(`products create --name "Creator Pro" -d description="For technical creators who want clean branding and low costs."`, 'prod');
  const priceCP = runStripe(`prices create --product "${prodCP}" --unit-amount 500 --currency usd -d "recurring[interval]=month"`, 'price');

  console.log('Creating Cloud Pro...');
  const prodCLP = runStripe(`products create --name "Cloud Pro" -d description="The It Just Works fully managed plan."`, 'prod');
  const priceCLP = runStripe(`prices create --product "${prodCLP}" --unit-amount 2000 --currency usd -d "recurring[interval]=month"`, 'price');

  console.log('Creating Lifetime Deal...');
  const prodLTD = runStripe(`products create --name "Lifetime License" -d description="Anti-SaaS. Own the software forever."`, 'prod');
  const priceLTD = runStripe(`prices create --product "${prodLTD}" --unit-amount 8900 --currency usd`, 'price');

  const envLines = [
    `\n# Stripe Auto-Generated Prices`,
    `STRIPE_PRICE_ID_POWER_PASS=${pricePP}`,
    `STRIPE_PRICE_ID_CREATOR_PRO=${priceCP}`,
    `STRIPE_PRICE_ID_CLOUD_PRO=${priceCLP}`,
    `STRIPE_PRICE_ID_LIFETIME_DEAL=${priceLTD}`
  ].join('\n');

  fs.appendFileSync('.env', envLines + '\n');
  console.log('✅ Successfully created products and appended price IDs to .env!');
} catch (err) {
  console.error('Failed to create Stripe products:', err.message);
  if (err.stdout) console.error(err.stdout.toString());
}
