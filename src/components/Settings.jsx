import { useApp } from '../context/AppContext';
import { exportData, importData, getCurrentUserId } from '../utils/localStorage';

const Settings = () => {
  const { friends } = useApp();
  const userId = getCurrentUserId();

  const handleExport = () => {
    exportData();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importData(event.target.result);
      if (result.success) {
        alert('Data imported successfully! Refresh the page to see your contacts.');
        window.location.reload();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#edc4b3] mb-6">Settings</h2>

      <div className="bg-[#3d241a] border border-[#774936] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#edc4b3] mb-4">Account</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#b07d62]">Your Code:</span>
            <span className="text-[#edc4b3] font-mono text-lg">{userId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#b07d62]">Total Contacts:</span>
            <span className="text-[#edc4b3]">{friends.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#3d241a] border border-[#774936] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#edc4b3] mb-4">Data Management</h3>
        <p className="text-[#b07d62] text-sm mb-4">
          Your data is saved locally on this device. Use export/import to transfer data between devices.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] px-6 py-3 rounded-lg transition-all font-medium"
          >
            Export Data (Backup)
          </button>

          <div>
            <label className="block w-full">
              <span className="sr-only">Import data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="block w-full bg-[#4a2f1f] hover:bg-[#5a3f2f] text-[#edc4b3] px-6 py-3 rounded-lg transition-all font-medium text-center cursor-pointer"
              >
                Import Data (Restore)
              </label>
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#4a2f1f] rounded-lg border border-[#8a5a44]">
          <p className="text-[#edc4b3] text-sm font-semibold mb-2">How to sync across devices:</p>
          <ol className="text-[#b07d62] text-sm space-y-1 list-decimal list-inside">
            <li>Export your data on this device</li>
            <li>Send the file to your other device (email, cloud, etc.)</li>
            <li>Import the file on your other device using the same code</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
