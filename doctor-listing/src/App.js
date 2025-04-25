import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import useFetchDoctors from './hooks/useFetchDoctors';
import DoctorList from './components/DoctorList';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import './App.css';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

function App() {
  const { data: allDoctors, loading, error } = useFetchDoctors(API_URL);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationTypeFilter, setConsultationTypeFilter] = useState('');
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const updateQueryParameters = useCallback(
    (search, consultationType, specialties, sort) => {
      const queryParams = {};
      if (search) queryParams.search = search;
      if (consultationType) queryParams.consultationType = consultationType;
      if (specialties.length > 0) queryParams.specialty = specialties;
      if (sort) queryParams.sort = sort;

      const queryStringified = queryString.stringify(queryParams);
      navigate(`?${queryStringified}`, { replace: true });
    },
    [navigate]
  );

  const applyFiltersAndSort = useCallback(
    (doctors, search, consultationType, specialties, sort) => {
      let filtered = [...doctors];

      if (search) {
        filtered = filtered.filter(doctor =>
          doctor.name && doctor.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (consultationType === 'video') {
        filtered = filtered.filter(doctor => doctor.video_consult === true);
      } else if (consultationType === 'inClinic') {
        filtered = filtered.filter(doctor => doctor.in_clinic === true);
      } else if (consultationType === '') {
        // No consultation type filter
      }

      if (specialties.length > 0) {
        filtered = filtered.filter(doctor =>
          doctor.specialities && doctor.specialities.some(specObject => specialties.includes(specObject.name))
        );
      }

      if (sort === 'fees') {
        filtered.sort((a, b) => {
          const priceA = parseInt(a.fees.replace('₹ ', ''), 10);
          const priceB = parseInt(b.fees.replace('₹ ', ''), 10);
          return priceA - priceB;
        });
      } else if (sort === 'experience') {
        filtered.sort((a, b) => {
          const expA = parseInt(a.experience.split(' ')[0], 10);
          const expB = parseInt(b.experience.split(' ')[0], 10);
          return expB - expA;
        });
      } else if (sort === '') {
        // No sorting applied
      }

      setFilteredDoctors(filtered);
      updateQueryParameters(search, consultationType, specialties, sort);
    },
    [setFilteredDoctors, updateQueryParameters]
  );

  useEffect(() => {
    if (allDoctors) {
      applyFiltersAndSort(allDoctors, searchTerm, consultationTypeFilter, specialtyFilters, sortOption);
    }
  }, [allDoctors, searchTerm, consultationTypeFilter, specialtyFilters, sortOption, applyFiltersAndSort]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleConsultationTypeChange = (type) => {
    setConsultationTypeFilter(prevType => (prevType === type ? '' : type));
  };

  const handleSpecialtyChange = (specialty, isChecked) => {
    if (isChecked) {
      setSpecialtyFilters(prevFilters => [...prevFilters, specialty]);
    } else {
      setSpecialtyFilters(prevFilters => prevFilters.filter(filter => filter !== specialty));
    }
  };

  const handleSortChange = (option) => {
    setSortOption(prevOption => (prevOption === option ? '' : option));
  };

  useEffect(() => {
    const parsedQuery = queryString.parse(location.search);
    setSearchTerm(parsedQuery.search || '');
    setConsultationTypeFilter(parsedQuery.consultationType || '');
    const specialtiesFromQuery = Array.isArray(parsedQuery.specialty) ? parsedQuery.specialty : (parsedQuery.specialty ? [parsedQuery.specialty] : []);
    setSpecialtyFilters(specialtiesFromQuery);
    setSortOption(parsedQuery.sort || '');
  }, [location.search]);

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  if (error) {
    return <div>Error loading doctors: {error.message}</div>;
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Doctor Listing</h1>
        <SearchBar doctors={allDoctors} onSearch={handleSearch} />
        <FilterPanel
          doctors={allDoctors}
          consultationType={consultationTypeFilter}
          specialtyFilters={specialtyFilters}
          sortOption={sortOption}
          onConsultationTypeChange={handleConsultationTypeChange}
          onSpecialtyChange={handleSpecialtyChange}
          onSortChange={handleSortChange}
        />
      </div>
      <div className="doctor-list-container">
        <DoctorList doctors={filteredDoctors} />
      </div>
    </div>
  );
}

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default Root;