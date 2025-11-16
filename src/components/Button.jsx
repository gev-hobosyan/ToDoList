import React from 'react';

const Button = ({ children, className, onClick }) => {
	return (
		<>
			<button className={`bg-green-900/30 px-6 py-2 rounded-full border border-green-950 cursor-pointer hover:scale-105 ${className}`} onClick={onClick}>{children}</button>
		</>
	);
};

export default React.memo(Button);