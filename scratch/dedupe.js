const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function dedupe() {
  console.log('--- Starting Deduping Process ---');

  // 1. Dedupe Product Types
  console.log('1. Checking Product Types...');
  const { data: types } = await supabase.from('product_types').select('*');
  const seenTypes = new Set();
  const typesToDelete = [];

  for (const t of types) {
    const key = `${t.product_id}-${t.name_ar.trim()}`;
    if (seenTypes.has(key)) {
      typesToDelete.push(t.id);
    } else {
      seenTypes.add(key);
    }
  }

  if (typesToDelete.length > 0) {
    console.log(`Deleting ${typesToDelete.length} duplicate types:`, typesToDelete);
    await supabase.from('product_types').delete().in('id', typesToDelete);
  } else {
    console.log('No duplicate types found.');
  }

  // 2. Dedupe Addon Group Items
  console.log('2. Checking Addon Group Items...');
  const { data: items } = await supabase.from('addon_group_items').select('*');
  const seenItems = new Set();
  const itemsToDelete = [];

  for (const item of items) {
    const key = `${item.addon_group_id}-${item.name_ar.trim()}`;
    if (seenItems.has(key)) {
      itemsToDelete.push(item.id);
    } else {
      seenItems.add(key);
    }
  }

  if (itemsToDelete.length > 0) {
    console.log(`Deleting ${itemsToDelete.length} duplicate group items:`, itemsToDelete);
    await supabase.from('addon_group_items').delete().in('id', itemsToDelete);
  } else {
    console.log('No duplicate group items found.');
  }

  // 3. Dedupe Addon Groups
  console.log('3. Checking Addon Groups...');
  const { data: groups } = await supabase.from('addon_groups').select('*');
  const seenGroups = new Set();
  const groupsToDelete = [];

  for (const g of groups) {
    const key = `${g.category_id}-${g.product_id}-${g.name_ar.trim()}`;
    if (seenGroups.has(key)) {
      groupsToDelete.push(g.id);
    } else {
      seenGroups.add(key);
    }
  }

  if (groupsToDelete.length > 0) {
    console.log(`Deleting ${groupsToDelete.length} duplicate groups:`, groupsToDelete);
    await supabase.from('addon_groups').delete().in('id', groupsToDelete);
  } else {
    console.log('No duplicate groups found.');
  }

  console.log('--- Deduping Finished ---');
}

dedupe();
