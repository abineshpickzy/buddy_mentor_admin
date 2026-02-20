import { useEffect, useState } from "react";
import { getUserLocation } from "@/features/users/userThunk";
import { useParams, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";

const ViewLocationsTab = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user } = useOutletContext();

  const [country, setCountry] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await dispatch(getUserLocation({ id: userId })).unwrap();
        if (response?.success) {
          setCountryOptions(response.data || []);
        }
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    fetchCountries();
  }, [dispatch, userId]);

  useEffect(() => {
    if (!user?.location || user.location.length === 0) return;
    const firstCountry = user.location[0].country;
    setCountry(firstCountry);
  }, [user]);

  useEffect(() => {
    if (!country) return;

    const fetchCitiesByCountry = async () => {
      try {
        const response = await dispatch(getUserLocation({ id: userId, country })).unwrap();
        if (response?.success) {
          const cities = response.data || [];
          setAllCities(cities);
          const uniqueStates = [...new Set(cities.map((c) => c.state))];
          setStateOptions(uniqueStates);

          if (user?.location?.length) {
            const userStates = [...new Set(user.location.map((c) => c.state))];
            const userCityIds = user.location.map((c) => c._id);
            setSelectedStates(userStates);
            setSelectedCities(userCityIds);
          }
        }
      } catch (error) {
        console.error("Failed to load cities:", error);
      }
    };
    fetchCitiesByCountry();
  }, [country, dispatch, userId]);

  useEffect(() => {
    if (selectedStates.length === 0) {
      setCityOptions([]);
      return;
    }
    const filteredCities = allCities.filter((city) => selectedStates.includes(city.state));
    setCityOptions(filteredCities);
  }, [selectedStates, allCities]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">Location Access</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">Country</label>
          <select
            value={country}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          >
            <option value="">Select Country</option>
            {countryOptions.map((countryOption, index) => (
              <option key={`${countryOption}-${index}`} value={countryOption}>
                {countryOption}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">States:</label>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded h-40 overflow-y-auto p-3 space-y-2">
            {stateOptions.map((state) => (
              <label key={state} className="flex justify-between items-center text-sm text-gray-700">
                <span>{state}</span>
                <input
                  type="checkbox"
                  checked={selectedStates.includes(state)}
                  disabled
                  className="w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">City:</label>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded h-48 overflow-y-auto p-3 space-y-2">
            {cityOptions.map((city) => (
              <label key={city._id} className="flex justify-between items-center text-sm text-gray-700">
                <span>{city.name}</span>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city._id)}
                  disabled
                  className="w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLocationsTab;
