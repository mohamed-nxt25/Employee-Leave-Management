import { Form, InputGroup } from 'react-bootstrap';
import { LuSearch } from 'react-icons/lu';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <InputGroup className="search-bar">
      <InputGroup.Text><LuSearch size={17} /></InputGroup.Text>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
