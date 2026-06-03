const Card = ({ children, className = '', onClick, ...props }) => {
  const baseStyles = 'bg-[#FAFAFA] rounded-2xl shadow-lg overflow-hidden border border-gray-100';
  const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1' : '';
  
  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

