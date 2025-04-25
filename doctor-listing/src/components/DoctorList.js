import React from 'react';

function DoctorList({ doctors }) {
  return (
    <div data-testid="doctor-list" className="doctor-list">
      {doctors.map((doctor) => (
        <div key={doctor.id} data-testid="doctor-card" className="doctor-card">
          <h2 data-testid="doctor-name">{doctor.name}</h2>
          <p data-testid="doctor-specialty">
            {Array.isArray(doctor.specialities)
              ? doctor.specialities.map(spec => spec.name).join(', ')
              : ''}
          </p>
          <p data-testid="doctor-experience"><strong>Experience:</strong> {doctor.experience} years</p>
          <p data-testid="doctor-fee"><strong>Fees:</strong> ₹{doctor.fees}</p>
        </div>
      ))}
      {doctors.length === 0 && <p>No doctors found matching your criteria.</p>}
    </div>
  );
}

export default DoctorList;