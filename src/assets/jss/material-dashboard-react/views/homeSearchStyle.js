import SearchBar from "material-ui-search-bar";
import styled from "styled-components";
import { Container } from "@material-ui/core";

const HomeSection = styled(Container)`
  background-color: white;
  max-width: none;
  text-align: center;
  font-weight: 500;
  padding: 5% 0;
`;

const MikeStlye = styled.div`
  color: #5dcbcb;
  font-family: Futura;
  font-weight: 600;
  margin-left: 20px;
  font-size: 4rem;
  display: inline;
`;

const SearchButton = styled(SearchBar)`
  &&& {
    width: 70%;
    height: 70px;
    margin: 20px auto;
    background-color: #eaeef1;
    box-shadow: none;
    border-radius: 20px;
    padding: 0 20px;
    .MuiInput-root {
      font-size: 35px;
      font-weight: 600;
      color: #a5a9aa;
    }
    .ForwardRef-searchIconButton-21 {
      background-color: #5dcbcb;
      width: 120px;
      height: 100%;
      color: white;
      font-size: 3rem;
      border-radius: 0 20px 20px 0;
    }
    .ForwardRef-iconButtonHidden-20 {
      width: 0;
    }
    .MuiSvgIcon-root {
      width: 2em;
      height: 2em;
    }
  }
`;

export { HomeSection, MikeStlye, SearchButton };
