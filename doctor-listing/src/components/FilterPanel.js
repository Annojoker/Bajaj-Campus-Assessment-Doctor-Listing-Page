import React from 'react';

function FilterPanel({
  doctors,
  consultationType,
  specialtyFilters,
  sortOption,
  onConsultationTypeChange,
  onSpecialtyChange,
  onSortChange,
}) {
  console.log("Doctors in FilterPanel:", doctors);
  const uniqueSpecialties = [
    ...new Set(
      doctors
        .flatMap(doctor => doctor.specialities)
        .filter(Boolean)
        .map(specialityObject => specialityObject.name)
    )
  ].sort();
  console.log("Unique Specialties:", uniqueSpecialties);

  const handleConsultationClick = (type) => {
    onConsultationTypeChange(consultationType === type ? '' : type);
  };

  const handleSortClick = (option) => {
    onSortChange(sortOption === option ? '' : option);
  };

  return (
    <div data-testid="filter-panel" className="filter-panel">
      <h3 data-testid="filter-header-moc">Consultation Mode</h3>
      <div>
        <label>
          <input
            type="radio"
            name="consultationType"
            value="video"
            data-testid="filter-video-consult"
            checked={consultationType === 'video'}
            onClick={() => handleConsultationClick('video')}
            onChange={() => {}}
          />
          Video Consult
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="consultationType"
            value="inClinic"
            data-testid="filter-in-clinic"
            checked={consultationType === 'inClinic'}
            onClick={() => handleConsultationClick('inClinic')}
            onChange={() => {}}
          />
          In Clinic
        </label>
      </div>

      <h3 data-testid="filter-header-speciality">Speciality</h3>
      <div>
        {uniqueSpecialties.map((specialty) => (
          <div key={specialty}>
            <label>
              <input
                type="checkbox"
                value={specialty}
                data-testid={`filter-specialty-${specialty.replace(/ /g, '-')}`}
                checked={specialtyFilters.includes(specialty)}
                onChange={(e) => onSpecialtyChange(specialty, e.target.checked)}
              />
              {specialty}
            </label>
          </div>
        ))}
      </div>

      <h3 data-testid="filter-header-sort">Sort</h3>
      <div>
        <label>
          <input
            type="radio"
            name="sortOption"
            value="fees"
            data-testid="sort-fees"
            checked={sortOption === 'fees'}
            onClick={() => handleSortClick('fees')}
            onChange={() => {}}
          />
          Fees (Ascending)
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="sortOption"
            value="experience"
            data-testid="sort-experience"
            checked={sortOption === 'experience'}
            onClick={() => handleSortClick('experience')}
            onChange={() => {}}
          />
          Experience (Descending)
        </label>
      </div>
    </div>
  );
}

export default FilterPanel;