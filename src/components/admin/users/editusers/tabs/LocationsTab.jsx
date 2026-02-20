import { useEffect, useState } from "react";
import { getUserLocation, editUser } from "@/features/users/userThunk";
import {addToast} from "@/features/toast/toastSlice";
import { useParams, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";



const LocationsTab = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { user, refetchUser } = useOutletContext();


  const [country, setCountry] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);

  const [allCities, setAllCities] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [originalCities, setOriginalCities] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);


  /* ----------------------------------------
     Load Countries (API returns array of strings)
     Example: ["India"]
  -----------------------------------------*/
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await dispatch(
          getUserLocation({ id: userId })
        ).unwrap();

        // response = { success: true, data: ["India"] }

        if (response?.success) {
          setCountryOptions(response.data || []);
        }
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };

    fetchCountries();
  }, [dispatch, userId]);

  /* ----------------------------------------
     When user alrady have locations
  -----------------------------------------*/
useEffect(() => {
  if (!user?.location || user.location.length === 0) return;

  const firstCountry = user.location[0].country;
  setCountry(firstCountry);
}, [user]);

  /* ----------------------------------------
     When Country Changes → Fetch Cities + States
  -----------------------------------------*/
  useEffect(() => {
    if (!country) return;

    const fetchCitiesByCountry = async () => {
      try {
        const response = await dispatch(
          getUserLocation({ id: userId, country })
        ).unwrap();

        // response.data should be:
        // [{ _id, name, state, country }]

        if (response?.success) {
          const cities = response.data || [];

          setAllCities(cities);

          const uniqueStates = [
            ...new Set(cities.map((c) => c.state))
          ];

          setStateOptions(uniqueStates);

           //  PRESELECT FROM USER LOCATION
        if (user?.location?.length) {
          const userStates = [
            ...new Set(user.location.map((c) => c.state))
          ];

          const userCityIds = user.location.map((c) => c._id);

          setSelectedStates(userStates);
          setSelectedCities(userCityIds);
          setOriginalCities(userCityIds);
        }
        }
      } catch (error) {
        console.error("Failed to load cities:", error);
      }
    };

    fetchCitiesByCountry();
  }, [country, dispatch, userId]);

  /* ----------------------------------------
     Filter Cities When States Selected
  -----------------------------------------*/
  useEffect(() => {
    if (selectedStates.length === 0) {
      setCityOptions([]);
      setSelectedCities([]);
      return;
    }

    const filteredCities = allCities.filter((city) =>
      selectedStates.includes(city.state)
    );

    setCityOptions(filteredCities);
  }, [selectedStates, allCities]);

  useEffect(() => {
    const selectedSorted = [...selectedCities].sort();
    const originalSorted = [...originalCities].sort();
    setHasChanges(JSON.stringify(selectedSorted) !== JSON.stringify(originalSorted));
  }, [selectedCities, originalCities]);

  /* ----------------------------------------
     Toggle Functions
  -----------------------------------------*/
  const toggleState = (state) => {
    setSelectedStates((prev) =>
      prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state]
    );
  };

  const toggleCity = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((c) => c !== cityId)
        : [...prev, cityId]
    );
  };

  const toggleAllStates = () => {
    setSelectedStates((prev) =>
      prev.length === stateOptions.length ? [] : stateOptions
    );
  };

  const toggleAllCities = () => {
    const cityIds = cityOptions.map((c) => c._id);

    setSelectedCities((prev) =>
      prev.length === cityIds.length ? [] : cityIds
    );
  };

    /* ----------------------------------------
     saev Functions
  -----------------------------------------*/

  const handleSave = async () => {
    try {
      console.log("Selected Cities:", selectedCities);
      await dispatch(

       editUser({
          userId: userId,
          userData: {
          location:selectedCities
          },
        })
      ).unwrap();

      await refetchUser();

      dispatch(addToast({ type: "success", message: "User location updated successfully!" }));
    } catch (error) {
      console.error("Failed to save user location:", error);
    }
    
  };

  /* ----------------------------------------
     UI
  -----------------------------------------*/
 return (
  <div className=" min-h-screen p-6">
    <div className="max-w-xl">

      <h3 className="text-lg font-semibold mb-6 text-gray-700">
        Location Access
      </h3>

      {/* ---------------- Country ---------------- */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Country
        </label>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="">Select Country</option>
          {countryOptions.map((countryOption, index) => (
            <option key={`${countryOption}-${index}`} value={countryOption}>
              {countryOption}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- States ---------------- */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            States:
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            Select all
            <input
              type="checkbox"
              checked={
                selectedStates.length === stateOptions.length &&
                stateOptions.length > 0
              }
              onChange={toggleAllStates}
              disabled={!country}
              className="w-4 h-4"
            />
          </label>
        </div>

        <div className="bg-white border border-gray-300 rounded h-40 overflow-y-auto p-3 space-y-2">
          {stateOptions.map((state) => (
            <label key={state} className="flex justify-between items-center text-sm text-gray-700">
              <span>{state}</span>
              <input
                type="checkbox"
                checked={selectedStates.includes(state)}
                onChange={() => toggleState(state)}
                className="w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ---------------- Cities ---------------- */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            City:
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            Select all
            <input
              type="checkbox"
              checked={
                selectedCities.length === cityOptions.length &&
                cityOptions.length > 0
              }
              onChange={toggleAllCities}
              disabled={selectedStates.length === 0}
              className="w-4 h-4"
            />
          </label>
        </div>

        <div className="bg-white border border-gray-300 rounded h-48 overflow-y-auto p-3 space-y-2">
          {cityOptions.map((city) => (
            <label
              key={city._id}
              className="flex justify-between items-center text-sm text-gray-700"
            >
              <span>{city.name}</span>
              <input
                type="checkbox"
                checked={selectedCities.includes(city._id)}
                onChange={() => toggleCity(city._id)}
                className="w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ---------------- Save Button ---------------- */}
      <button
        onClick={handleSave}
        disabled={!hasChanges}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Save
      </button>

    </div>
  </div>
);

};

export default LocationsTab;
