import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { parseContactFile, checkForDuplicates } from '../utils/importParsers';

const ImportWizard = ({ onClose }) => {
  const { friends, categories, addFriend } = useApp();

  // Wizard state
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Configure, 4: Execute
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Import data state
  const [parsedContacts, setParsedContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [defaultFrequency, setDefaultFrequency] = useState({ value: 3, unit: 'months' });

  // Set default category to 'Acquaintances' on mount
  useEffect(() => {
    const acquaintances = categories.find(cat => cat.name === 'Acquaintances');
    if (acquaintances) {
      setSelectedCategory(acquaintances.id);
    } else if (categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  // Handle file input change
  const handleFileInput = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  // Process uploaded file
  const handleFile = async (file) => {
    setLoading(true);
    setError(null);

    try {
      // Parse the file
      const contacts = await parseContactFile(file);

      if (contacts.length === 0) {
        throw new Error('No valid contacts found in the file. Please check the file format.');
      }

      // Check for duplicates
      const contactsWithDuplicates = checkForDuplicates(contacts, friends);

      // Set parsed contacts and pre-select non-duplicates
      setParsedContacts(contactsWithDuplicates);
      const nonDuplicateIds = new Set(
        contactsWithDuplicates
          .filter(c => !c.isDuplicate)
          .map(c => c.id)
      );
      setSelectedContacts(nonDuplicateIds);

      // Move to preview step
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle contact selection
  const toggleContact = (contactId) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  // Select/deselect all non-duplicate contacts
  const toggleSelectAll = () => {
    const nonDuplicates = parsedContacts.filter(c => !c.isDuplicate);
    if (selectedContacts.size === nonDuplicates.length) {
      // Deselect all
      setSelectedContacts(new Set());
    } else {
      // Select all non-duplicates
      setSelectedContacts(new Set(nonDuplicates.map(c => c.id)));
    }
  };

  // Import selected contacts
  const handleImport = () => {
    const contactsToImport = parsedContacts.filter(c => selectedContacts.has(c.id));

    contactsToImport.forEach(contact => {
      const friendData = {
        name: contact.name,
        contact: contact.contactInfo,
        lastContacted: null, // Fresh seeds
        contactFrequency: defaultFrequency,
        categories: [selectedCategory],
        notes: `Imported from ${contact.source.toUpperCase()}`,
        contactHistory: [],
        importantDates: []
      };

      addFriend(friendData);
    });

    // Close the wizard
    onClose();
  };

  // Render Step 1: Upload
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#edc4b3] mb-2">Sow Seeds</h3>
        <p className="text-[#c38e70]">Import contacts from other apps</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${dragActive
            ? 'border-[#c38e70] bg-[#3d241a]'
            : 'border-[#774936] bg-[#2d1810]'
          }
          ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-[#b07d62]'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.vcf,.vcard"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-6xl">🌱</div>
          <div>
            <p className="text-lg text-[#edc4b3] font-semibold mb-2">
              {loading ? 'Parsing your seeds...' : 'Drop your vCard or CSV file here to sow new seeds'}
            </p>
            <p className="text-sm text-[#c38e70]">
              {loading ? 'This may take a moment...' : 'or click to browse'}
            </p>
          </div>
          <div className="text-xs text-[#b07d62]">
            Supports: .csv, .vcf (vCard)
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c38e70]"></div>
          </div>
        )}
      </div>
    </div>
  );

  // Render Step 2: Preview & Select
  const renderPreviewStep = () => {
    const selectedCount = selectedContacts.size;
    const totalNonDuplicates = parsedContacts.filter(c => !c.isDuplicate).length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#edc4b3] mb-1">Preview Seeds</h3>
            <p className="text-sm text-[#c38e70]">
              Select which contacts to import ({selectedCount} selected)
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="text-[#c38e70] hover:text-[#edc4b3] text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="flex items-center justify-between bg-[#2d1810] rounded-lg p-3 border border-[#774936]">
          <span className="text-[#edc4b3] text-sm">
            {totalNonDuplicates} new contacts found
          </span>
          <button
            onClick={toggleSelectAll}
            className="text-sm text-[#c38e70] hover:text-[#edc4b3] font-semibold"
          >
            {selectedCount === totalNonDuplicates ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 bg-[#2d1810] rounded-lg p-4 border border-[#774936]">
          {parsedContacts.map(contact => (
            <div
              key={contact.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all
                ${contact.isDuplicate
                  ? 'bg-[#3d241a]/50 border-[#774936]/50 opacity-60'
                  : 'bg-[#3d241a] border-[#774936] hover:border-[#b07d62]'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedContacts.has(contact.id)}
                onChange={() => toggleContact(contact.id)}
                disabled={contact.isDuplicate}
                className="w-4 h-4 rounded border-[#774936] text-[#c38e70] focus:ring-[#c38e70] focus:ring-offset-0 disabled:opacity-50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#edc4b3] truncate">{contact.name}</p>
                  {contact.isDuplicate && (
                    <span className="text-xs bg-yellow-900/30 text-yellow-200 px-2 py-0.5 rounded-full">
                      Already in Garden
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#c38e70] truncate">{contact.contactInfo}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setStep(3)}
            disabled={selectedCount === 0}
            className="
              px-6 py-2 bg-[#c38e70] text-[#2d1810] rounded-lg font-semibold
              hover:bg-[#edc4b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Next: Configure →
          </button>
        </div>
      </div>
    );
  };

  // Render Step 3: Configuration
  const renderConfigureStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#edc4b3] mb-1">Configure Import</h3>
          <p className="text-sm text-[#c38e70]">Set defaults for imported contacts</p>
        </div>
        <button
          onClick={() => setStep(2)}
          className="text-[#c38e70] hover:text-[#edc4b3] text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-4 bg-[#2d1810] rounded-lg p-6 border border-[#774936]">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#edc4b3] mb-2">
            Assign Plot (Category)
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="
              w-full px-4 py-2 bg-[#3d241a] border border-[#774936] rounded-lg
              text-[#edc4b3] focus:outline-none focus:ring-2 focus:ring-[#c38e70]
            "
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#b07d62] mt-1">
            All imported contacts will be added to this plot
          </p>
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#edc4b3] mb-2">
            Default Contact Frequency
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={defaultFrequency.value}
              onChange={(e) => setDefaultFrequency({
                ...defaultFrequency,
                value: parseInt(e.target.value) || 1
              })}
              className="
                w-20 px-3 py-2 bg-[#3d241a] border border-[#774936] rounded-lg
                text-[#edc4b3] focus:outline-none focus:ring-2 focus:ring-[#c38e70]
              "
            />
            <select
              value={defaultFrequency.unit}
              onChange={(e) => setDefaultFrequency({
                ...defaultFrequency,
                unit: e.target.value
              })}
              className="
                flex-1 px-4 py-2 bg-[#3d241a] border border-[#774936] rounded-lg
                text-[#edc4b3] focus:outline-none focus:ring-2 focus:ring-[#c38e70]
              "
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
          <p className="text-xs text-[#b07d62] mt-1">
            How often you want to stay in touch with these contacts
          </p>
        </div>
      </div>

      <div className="bg-[#3d241a] rounded-lg p-4 border border-[#774936]">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm text-[#edc4b3] font-semibold mb-1">Import Summary</p>
            <p className="text-sm text-[#c38e70]">
              {selectedContacts.size} contacts will be imported with no contact history.
              They'll be treated as fresh seeds waiting to be nurtured.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setStep(4)}
          className="
            px-6 py-2 bg-[#c38e70] text-[#2d1810] rounded-lg font-semibold
            hover:bg-[#edc4b3] transition-colors
          "
        >
          Next: Review →
        </button>
      </div>
    </div>
  );

  // Render Step 4: Execute
  const renderExecuteStep = () => {
    const categoryObj = categories.find(cat => cat.id === selectedCategory);
    const contactsToImport = parsedContacts.filter(c => selectedContacts.has(c.id));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#edc4b3] mb-1">Ready to Plant</h3>
            <p className="text-sm text-[#c38e70]">Review and confirm your import</p>
          </div>
          <button
            onClick={() => setStep(3)}
            className="text-[#c38e70] hover:text-[#edc4b3] text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="bg-[#2d1810] rounded-lg p-6 border border-[#774936] space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#774936]">
            <span className="text-[#c38e70]">Contacts to Import:</span>
            <span className="text-[#edc4b3] font-bold text-xl">{contactsToImport.length}</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-[#774936]">
            <span className="text-[#c38e70]">Plot:</span>
            <div className="flex items-center gap-2">
              {categoryObj && (
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryObj.color }}
                ></span>
              )}
              <span className="text-[#edc4b3] font-semibold">
                {categoryObj?.name || 'None'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#c38e70]">Contact Frequency:</span>
            <span className="text-[#edc4b3] font-semibold">
              Every {defaultFrequency.value} {defaultFrequency.unit}
            </span>
          </div>
        </div>

        <div className="bg-[#3d241a] rounded-lg p-4 border border-[#8a5a44]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div className="flex-1">
              <p className="text-sm text-[#edc4b3] font-semibold mb-1">About to Plant</p>
              <p className="text-sm text-[#c38e70]">
                These contacts will be added to your garden as fresh seeds.
                You can edit their details individually after importing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="
              px-6 py-2 bg-[#3d241a] text-[#c38e70] rounded-lg font-semibold border border-[#774936]
              hover:bg-[#2d1810] transition-colors
            "
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="
              px-6 py-2 bg-[#c38e70] text-[#2d1810] rounded-lg font-semibold
              hover:bg-[#edc4b3] transition-colors flex items-center gap-2
            "
          >
            <span>🌱</span>
              Plant Seeds
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3d241a] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#774936]">
        <div className="sticky top-0 bg-[#3d241a] border-b border-[#774936] p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${s === step
                    ? 'bg-[#c38e70] text-[#2d1810]'
                    : s < step
                    ? 'bg-[#b07d62] text-[#2d1810]'
                    : 'bg-[#2d1810] text-[#774936] border border-[#774936]'
                  }
                `}
              >
                {s}
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-[#c38e70] hover:text-[#edc4b3] text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {step === 1 && renderUploadStep()}
          {step === 2 && renderPreviewStep()}
          {step === 3 && renderConfigureStep()}
          {step === 4 && renderExecuteStep()}
        </div>
      </div>
    </div>
  );
};

export default ImportWizard;
