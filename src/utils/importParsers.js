import Papa from 'papaparse';

/**
 * Parse a CSV file and extract contact information
 * Supports various CSV formats from different contact apps
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const contacts = results.data.map((row, index) => {
            // Try to find name field (different apps use different headers)
            const name = row.Name || row['Full Name'] || row.FN ||
                        row['First Name'] + ' ' + row['Last Name'] ||
                        row.name || row.fullname || '';

            // Try to find contact info (phone or email)
            const contactInfo = row.Phone || row['Phone Number'] || row.TEL ||
                               row.Email || row['Email Address'] || row.EMAIL ||
                               row.phone || row.email || row.tel || '';

            // Skip rows without both name and contact info
            if (!name.trim() || !contactInfo.trim()) {
              return null;
            }

            return {
              id: `import_${Date.now()}_${index}`,
              name: name.trim(),
              contactInfo: contactInfo.trim(),
              source: 'csv'
            };
          }).filter(contact => contact !== null);

          resolve(contacts);
        } catch (error) {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

/**
 * Parse a vCard (.vcf) file and extract contact information
 * Uses regex to extract FN (Full Name), TEL (Phone), and EMAIL fields
 */
export const parseVCard = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;

        // Split into individual vCards (some files contain multiple contacts)
        const vcards = content.split(/BEGIN:VCARD/i).filter(v => v.trim());

        const contacts = vcards.map((vcard, index) => {
          // Extract Full Name (FN field)
          const fnMatch = vcard.match(/FN[;:]([^\r\n]+)/i);
          const name = fnMatch ? fnMatch[1].trim() : '';

          // Extract Phone Number (TEL field - take the first one)
          const telMatch = vcard.match(/TEL[;:]([^\r\n]+)/i);
          let phone = telMatch ? telMatch[1].trim() : '';

          // Clean up phone number (remove TYPE= and other vCard syntax)
          if (phone) {
            phone = phone.replace(/TYPE=[^:]+:/gi, '').trim();
          }

          // Extract Email (EMAIL field - take the first one)
          const emailMatch = vcard.match(/EMAIL[;:]([^\r\n]+)/i);
          let email = emailMatch ? emailMatch[1].trim() : '';

          // Clean up email (remove TYPE= and other vCard syntax)
          if (email) {
            email = email.replace(/TYPE=[^:]+:/gi, '').trim();
          }

          // Use phone if available, otherwise email
          const contactInfo = phone || email;

          // Skip if no name or contact info
          if (!name || !contactInfo) {
            return null;
          }

          return {
            id: `import_${Date.now()}_${index}`,
            name: name,
            contactInfo: contactInfo,
            source: 'vcf'
          };
        }).filter(contact => contact !== null);

        resolve(contacts);
      } catch (error) {
        reject(new Error(`Failed to parse vCard: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read vCard file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Main parser function that routes to the appropriate parser based on file type
 */
export const parseContactFile = async (file) => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.csv')) {
    return await parseCSV(file);
  } else if (fileName.endsWith('.vcf') || fileName.endsWith('.vcard')) {
    return await parseVCard(file);
  } else {
    throw new Error('Unsupported file type. Please upload a .csv or .vcf file.');
  }
};

/**
 * Check for duplicate contacts by comparing names
 * Returns contacts with a 'duplicate' flag if they already exist
 */
export const checkForDuplicates = (importedContacts, existingFriends) => {
  const existingNames = new Set(
    existingFriends.map(friend => friend.name.toLowerCase().trim())
  );

  return importedContacts.map(contact => ({
    ...contact,
    isDuplicate: existingNames.has(contact.name.toLowerCase().trim())
  }));
};
