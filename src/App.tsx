import React, { useState } from 'react';
import { VirtualizedCombobox } from './components/virtualized-combobox';

const options = [
	{ id: '1', value: 'Option 1' },
	{ id: '2', value: 'Option 2' },
	{ id: '3', value: 'Option 3' },
	{ id: '4', value: 'Option 4' },
	{ id: '5', value: 'Option 5' },
	// Add more items as needed
];

function App() {
	const [selectedOption, setSelectedOption] = useState(null);

	const handleSelectionChange = selected => {
		setSelectedOption(selected);
		console.log('Selected option:', selected);
	};

	return (
		<div>
			<h1>Virtualized Combobox Example</h1>
			<VirtualizedCombobox
				options={options}
				searchPlaceholder='Search options...'
				displayProp='value'
				idProp='id'
				onSelectionChange={handleSelectionChange}
				width='300px'
				height='300px'
			/>
			{selectedOption && <p>Selected: {selectedOption.value}</p>}
		</div>
	);
}

export default App;
