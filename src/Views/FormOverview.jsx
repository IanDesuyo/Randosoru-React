import React, { useEffect, useState } from "react";
import { useFav } from "../Services/Favorite";
import { useParams } from "react-router-dom";
import Axios from "axios";
import RecordRow from "../Components/RecordRow";

const FormOverview = () => {
  const { id } = useParams();
  const { setCurrentForm } = useFav();
  const overview = useOverview(id);

  useEffect(() => {
    setCurrentForm({ id: id, week: 0 });
  }, []);
  return <RecordRow />;
};

function useOverview(formId) {
  useEffect(() => {
    Axios.get(`/api/forms/${formId}/status`)
      .then(res => res.data)
      .then(console.log);
  }, [formId]);

  return true;
}

export default FormOverview;
