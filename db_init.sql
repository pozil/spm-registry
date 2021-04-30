--
-- TOC entry 206 (class 1259 OID 16463)
-- Name: install_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.install_metrics (
    id integer NOT NULL,
    install_date time without time zone DEFAULT now() NOT NULL,
    package_version_id integer NOT NULL
);

--
-- TOC entry 207 (class 1259 OID 16475)
-- Name: install_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.install_metrics ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.install_metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
--
-- TOC entry 203 (class 1259 OID 16389)
-- Name: package_definitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_definitions (
    id integer NOT NULL,
    name character varying(240) NOT NULL,
    publisher character varying(80),
    latest_stable_version_id integer,
    published_date time without time zone DEFAULT now() NOT NULL,
    description character varying(1000),
    latest_beta_version_id integer
);

--
-- TOC entry 202 (class 1259 OID 16387)
-- Name: package_definition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.package_definitions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.package_definition_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- TOC entry 205 (class 1259 OID 16399)
-- Name: package_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_versions (
    id integer NOT NULL,
    sfdc_id character(15) NOT NULL,
    package_definition_id integer NOT NULL,
    name character varying(80),
    version character varying(30) NOT NULL,
    published_date time without time zone DEFAULT now() NOT NULL
);

--
-- TOC entry 204 (class 1259 OID 16397)
-- Name: package_version_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.package_versions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.package_version_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- TOC entry 3085 (class 2606 OID 16467)
-- Name: install_metrics install_metric_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.install_metrics
    ADD CONSTRAINT install_metric_pkey PRIMARY KEY (id);


--
-- TOC entry 3079 (class 2606 OID 16393)
-- Name: package_definitions package_definition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_definitions
    ADD CONSTRAINT package_definition_pkey PRIMARY KEY (id);


--
-- TOC entry 3082 (class 2606 OID 16403)
-- Name: package_versions package_version_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_versions
    ADD CONSTRAINT package_version_pkey PRIMARY KEY (id);


--
-- TOC entry 3075 (class 1259 OID 16457)
-- Name: fki_latest_beta_version_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_latest_beta_version_fkey ON public.package_definitions USING btree (latest_beta_version_id);


--
-- TOC entry 3076 (class 1259 OID 16415)
-- Name: fki_latest_stable_version_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_latest_stable_version_fkey ON public.package_definitions USING btree (latest_stable_version_id);


--
-- TOC entry 3080 (class 1259 OID 16409)
-- Name: fki_package_definition_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_package_definition_fkey ON public.package_versions USING btree (package_definition_id);


--
-- TOC entry 3083 (class 1259 OID 16473)
-- Name: fki_package_version_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_package_version_fkey ON public.install_metrics USING btree (package_version_id);


--
-- TOC entry 3077 (class 1259 OID 16451)
-- Name: name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX name_index ON public.package_definitions USING hash (name);


--
-- TOC entry 3087 (class 2606 OID 16458)
-- Name: package_definitions latest_beta_version_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_definitions
    ADD CONSTRAINT latest_beta_version_fkey FOREIGN KEY (latest_beta_version_id) REFERENCES public.package_versions(id) NOT VALID;


--
-- TOC entry 3086 (class 2606 OID 16410)
-- Name: package_definitions latest_stable_version_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_definitions
    ADD CONSTRAINT latest_stable_version_fkey FOREIGN KEY (latest_stable_version_id) REFERENCES public.package_versions(id) NOT VALID;


--
-- TOC entry 3088 (class 2606 OID 16446)
-- Name: package_versions package_definition_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_versions
    ADD CONSTRAINT package_definition_fkey FOREIGN KEY (package_definition_id) REFERENCES public.package_definitions(id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3089 (class 2606 OID 16477)
-- Name: install_metrics package_version_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.install_metrics
    ADD CONSTRAINT package_version_fkey FOREIGN KEY (package_version_id) REFERENCES public.package_versions(id) ON DELETE CASCADE NOT VALID;
