const InputField = ({ label, value, onChange, name, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md shadow-sm"
    />
  </div>
);

export default InputField;
