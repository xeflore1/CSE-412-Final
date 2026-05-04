--
-- PostgreSQL database dump
--

\restrict kJ7ti6GtYkJenRXdtMTdxqrJEQYWqrfC7ddhFogn0myIWLlmq1tlS168FsAVLX5

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: aptstatus; Type: TYPE; Schema: public; Owner: xavier
--

CREATE TYPE public.aptstatus AS ENUM (
    'ongoing',
    'completed',
    'cancelled'
);


ALTER TYPE public.aptstatus OWNER TO xavier;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: xavier
--

CREATE TABLE public.appointments (
    appointmentid integer NOT NULL,
    donorid integer NOT NULL,
    staffid integer NOT NULL,
    dateofappt date NOT NULL,
    status public.aptstatus DEFAULT 'ongoing'::public.aptstatus
);


ALTER TABLE public.appointments OWNER TO xavier;

--
-- Name: bloodunits; Type: TABLE; Schema: public; Owner: xavier
--

CREATE TABLE public.bloodunits (
    unitid integer NOT NULL,
    appointmentid integer NOT NULL,
    bloodtype character varying(4) DEFAULT NULL::character varying,
    volume_ml numeric(7,3),
    isavailable boolean DEFAULT true NOT NULL,
    datedrawn date DEFAULT CURRENT_DATE,
    notes text,
    CONSTRAINT bloodunits_bloodtype_check CHECK (((bloodtype)::text = ANY ((ARRAY['A+'::character varying, 'A-'::character varying, 'B+'::character varying, 'B-'::character varying, 'AB+'::character varying, 'AB-'::character varying, 'O+'::character varying, 'O-'::character varying])::text[])))
);


ALTER TABLE public.bloodunits OWNER TO xavier;

--
-- Name: donors; Type: TABLE; Schema: public; Owner: xavier
--

CREATE TABLE public.donors (
    userid integer NOT NULL,
    bloodtype character varying(4) DEFAULT NULL::character varying,
    dob date NOT NULL,
    CONSTRAINT donors_bloodtype_check CHECK (((bloodtype)::text = ANY ((ARRAY['A+'::character varying, 'A-'::character varying, 'B+'::character varying, 'B-'::character varying, 'AB+'::character varying, 'AB-'::character varying, 'O+'::character varying, 'O-'::character varying])::text[])))
);


ALTER TABLE public.donors OWNER TO xavier;

--
-- Name: hospitalstaff; Type: TABLE; Schema: public; Owner: xavier
--

CREATE TABLE public.hospitalstaff (
    userid integer NOT NULL,
    jobtitle character varying(25) NOT NULL
);


ALTER TABLE public.hospitalstaff OWNER TO xavier;

--
-- Name: users; Type: TABLE; Schema: public; Owner: xavier
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(30) NOT NULL,
    email character varying(60) NOT NULL,
    pw character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO xavier;

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: xavier
--

ALTER TABLE public.users ALTER COLUMN userid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: xavier
--

COPY public.appointments (appointmentid, donorid, staffid, dateofappt, status) FROM stdin;
1	1	37	2020-06-21	completed
2	2	37	2025-04-18	completed
3	3	44	2023-05-23	ongoing
4	4	28	2021-06-11	cancelled
5	5	48	2020-12-01	ongoing
6	6	45	2024-07-01	cancelled
7	7	41	2023-10-18	completed
8	8	34	2024-03-25	cancelled
9	9	36	2021-09-11	cancelled
10	10	31	2021-10-24	cancelled
11	11	33	2020-09-12	ongoing
12	12	37	2022-11-02	cancelled
13	13	38	2025-05-31	cancelled
14	14	35	2021-09-20	cancelled
15	15	34	2023-06-10	cancelled
16	16	49	2021-03-15	completed
17	17	39	2021-06-03	completed
18	18	38	2025-05-18	cancelled
19	19	34	2022-02-07	cancelled
20	20	37	2022-02-08	cancelled
21	21	38	2023-11-18	cancelled
22	22	39	2024-11-25	completed
23	23	38	2021-04-09	cancelled
24	24	29	2023-08-08	cancelled
25	25	43	2023-10-12	ongoing
\.


--
-- Data for Name: bloodunits; Type: TABLE DATA; Schema: public; Owner: xavier
--

COPY public.bloodunits (unitid, appointmentid, bloodtype, volume_ml, isavailable, datedrawn, notes) FROM stdin;
1	1	B-	446.548	t	2020-06-21	\N
2	2	O-	503.183	t	2025-04-18	\N
3	7	A+	585.154	t	2023-10-18	\N
4	16	AB-	591.646	t	2021-03-15	\N
5	17	A+	449.489	t	2021-06-03	\N
6	22	O+	539.989	t	2024-11-25	\N
\.


--
-- Data for Name: donors; Type: TABLE DATA; Schema: public; Owner: xavier
--

COPY public.donors (userid, bloodtype, dob) FROM stdin;
1	B-	1981-02-21
2	O-	1971-08-08
3	B-	2014-03-03
4	AB-	1989-10-18
5	A-	2013-12-04
6	B-	1975-11-13
7	A+	1976-11-02
8	AB+	1975-03-28
9	AB-	2004-09-24
10	A-	1990-08-19
11	A-	1981-02-14
12	B+	2003-01-12
13	AB+	1994-04-27
14	O-	2016-07-12
15	B-	1999-01-10
16	AB-	1975-09-01
17	A+	1974-11-21
18	AB-	1985-05-22
19	O-	2011-12-31
20	O-	2001-11-30
21	A+	1976-10-19
22	O+	1996-10-09
23	AB-	1994-01-11
24	AB+	1970-10-05
25	AB+	1982-03-22
\.


--
-- Data for Name: hospitalstaff; Type: TABLE DATA; Schema: public; Owner: xavier
--

COPY public.hospitalstaff (userid, jobtitle) FROM stdin;
26	Nurse
27	Technician
28	Technician
29	Phlebotomist
30	Technician
31	Doctor
32	Doctor
33	Technician
34	Nurse
35	Phlebotomist
36	Technician
37	Technician
38	Phlebotomist
39	Technician
40	Doctor
41	Nurse
42	Doctor
43	Technician
44	Technician
45	Phlebotomist
46	Nurse
47	Technician
48	Nurse
49	Doctor
50	Technician
51	nurse
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: xavier
--

COPY public.users (userid, username, email, pw) FROM stdin;
1	User 1	user1@email.com	$argon2id$v=19$m=65536,t=3,p=4$X0utJzevIraUdEqYdDm95w$hgagpk5NsdXElBkNlmTi8oIflEwpw7cEO2dHgqxsUyg
2	User 2	user2@email.com	$argon2id$v=19$m=65536,t=3,p=4$urbhfB9UlfrbXlNWu6fQyA$7k9XYbMrR1zNr3eRs9ThiyRMCKjoTh6OxsdgwiuSwa0
3	User 3	user3@email.com	$argon2id$v=19$m=65536,t=3,p=4$pKrtb/+tyaOz20QCqPOgbw$bYwLz35ZPW2rMv+sYm4ZdR1TcSb1JR6U+vnmfEKeQ3A
4	User 4	user4@email.com	$argon2id$v=19$m=65536,t=3,p=4$MtU/M1Nvdw+/M4o5zFEf/A$gPHPlSipThrY9BQFYLKrBoJkGa7rjKPLJcJ6uTNiySY
5	User 5	user5@email.com	$argon2id$v=19$m=65536,t=3,p=4$871Xh+5FPTtl7+Q6WySJrw$C4QoFLOBP00nBKvjNUX970nSapFBo7SlcizUa1m/3hQ
6	User 6	user6@email.com	$argon2id$v=19$m=65536,t=3,p=4$Y7Mh+nqqAV0SoXzvuUhb9g$6+ug2vsAGt1BZy+NNLKPomPp2GcRiEkZAJmNBezAApY
7	User 7	user7@email.com	$argon2id$v=19$m=65536,t=3,p=4$3Sw6am3Kf+vrQ2fSqO+RpA$NGkl8VhBAA4xWtH5jEF7H5EjuUyfw15iGl0rTRc2MkQ
8	User 8	user8@email.com	$argon2id$v=19$m=65536,t=3,p=4$gBfoZ1NBxd9w37Qqs7LJbg$OyvY2kjw9kiI2L9dLHjZLnfpOfRHvnNrKGh/SpCPI14
9	User 9	user9@email.com	$argon2id$v=19$m=65536,t=3,p=4$YWuClRGARNLQryDEnyLUEQ$7S8pXgx3iwXdTmsPV/bf5tHD3dYoooNa8TAmVV0JIko
10	User 10	user10@email.com	$argon2id$v=19$m=65536,t=3,p=4$x3JYnugho1iBSAB9EM0EgA$wvX8CJeh3jNhhqBGQfXFqY2EHDIjWRkvaZJ0SaYDThE
11	User 11	user11@email.com	$argon2id$v=19$m=65536,t=3,p=4$a/lPZYg9afqcG57dzSPW/g$F3JShc8QqussTwh7D6y60vXnk6jI5c0Pw9bTiBLFD+o
12	User 12	user12@email.com	$argon2id$v=19$m=65536,t=3,p=4$+neVdKGA+9NMFINc4jMOIQ$DBkRN0LTWRXyr+ClIaNv4czh+FrRpJhydCAsL5EpJBw
13	User 13	user13@email.com	$argon2id$v=19$m=65536,t=3,p=4$CK667/vVcyZN0elSzamqOQ$5r9zTr799Z8nFHuNA+qM2SAmkiPXtuh4De80I5Hm7aE
14	User 14	user14@email.com	$argon2id$v=19$m=65536,t=3,p=4$vWtOFnrdee6z5wDWmIkqlQ$MvYisXjJ93dH4Z9F1asARu7WKDh4GvriI1ncMKTqL2o
15	User 15	user15@email.com	$argon2id$v=19$m=65536,t=3,p=4$9H3sVkWFR+S5ThmJgA5Dvg$wnlOSfgRVaNbr2zFKA+asSJgh2l+7zizM77DvuGSdRg
16	User 16	user16@email.com	$argon2id$v=19$m=65536,t=3,p=4$1noM41JircAUVtlbCfjiaQ$HILzyqTkIWlLAdonkOgYQ/V2fUtD1syLimoHFi+bzSo
17	User 17	user17@email.com	$argon2id$v=19$m=65536,t=3,p=4$fdXiZjSaW4mlHrTh1ToPMA$alC2VTg5/nIAh9qFNc9nzF/FioiS4ars/nx/HUkIJU4
18	User 18	user18@email.com	$argon2id$v=19$m=65536,t=3,p=4$xDPmZXtspMx8HNQhC3cjHQ$EOyqLJY8qWZmHsOJfnd5cz4ppwq54h1E8qq5JdUSBOM
19	User 19	user19@email.com	$argon2id$v=19$m=65536,t=3,p=4$3XWKOxOI8sURk3XaAvFhcA$K7jw+0QB3Qhm9/suXeMbWXVKXzgHuNMuHZL8lPIU7H4
20	User 20	user20@email.com	$argon2id$v=19$m=65536,t=3,p=4$nzQOTBW5uxPdK+7E6jdpXA$La1ZsUcY1sZ/QSFIY/pzLjrR266kLwB+olugkE3P+Fw
21	User 21	user21@email.com	$argon2id$v=19$m=65536,t=3,p=4$Grc4mi5MJ7D+0oBybDVm7Q$ZOa+xqIz5V4TyXpa3kbvt7McC92HINtbrq76K6bfV8k
22	User 22	user22@email.com	$argon2id$v=19$m=65536,t=3,p=4$zQ3zjeamkx5PmB74ylc+oA$lg0hJeE+dpgwoAWuHcy9KKilhjWAG/oQsmvVjDFgGgw
23	User 23	user23@email.com	$argon2id$v=19$m=65536,t=3,p=4$f8rOtSWbT/YG47tMWwQiDg$9ssSuTnz3UVGrksWuvsLi0LKapOFC03t4zc78RT+QDg
24	User 24	user24@email.com	$argon2id$v=19$m=65536,t=3,p=4$+nPwTIXKHv3tQvWFVeET9Q$z3LIowG/H9tAZh+wZC/G0FxHf6k/TCjCwKzwyy9zilE
25	User 25	user25@email.com	$argon2id$v=19$m=65536,t=3,p=4$Zm1/u4WVaCEzBlq51dIDLA$wrIGrN4uxl5CuDdQH7HgU3bcsGYOe5leN2Gsc2GCMPw
26	User 26	user26@email.com	$argon2id$v=19$m=65536,t=3,p=4$dzaroV9RfU0GVfXyYrZqQw$9/87tR3nE7pIPVk+gLuIOAaWHcNq7jb0DmSs9SXXWcY
27	User 27	user27@email.com	$argon2id$v=19$m=65536,t=3,p=4$YyCEby9ePevSRDq4++GmGA$9Vl3YmbxYcaYQU5Cr52qy/PgCOvUaUl8zlefjqVLezs
28	User 28	user28@email.com	$argon2id$v=19$m=65536,t=3,p=4$LiNsv5L6ltkKiBVGl4tPPA$pPOcSJxmv0GzF1dlnTsi54WU2KN6rpIedTmxiJlBTXo
29	User 29	user29@email.com	$argon2id$v=19$m=65536,t=3,p=4$RgIP9o5Z3CJbQFT8WuFDGg$h2ZbZa4KD11rP4c9fzgw8wsvNym6YGhowbZ4fMgDq/w
30	User 30	user30@email.com	$argon2id$v=19$m=65536,t=3,p=4$zBXdawakrYIWW2OldO9elw$W7Sb5jqfpvG0KSC4A9xXzv+DrcaZnuDNPAp1RBMiq04
31	User 31	user31@email.com	$argon2id$v=19$m=65536,t=3,p=4$ORwc0kSDvfGk9MC4+VuC4A$8vwuE+i8AHxeWaYcCsAbX/wOpd9imkEV8GTiBHj5RY0
32	User 32	user32@email.com	$argon2id$v=19$m=65536,t=3,p=4$f3M4yWrGhggqOLULE7F9Fg$fXHZEeDv0Nuf5+oLpz+gK68y1VrI/eZw5UcIFWPqnLk
33	User 33	user33@email.com	$argon2id$v=19$m=65536,t=3,p=4$G15gfR9YOy2p4jKRcqdVXg$fE3bj+vXnwjr4Q/14A5bnlxIqBavO3kBpd39XzLkdpM
34	User 34	user34@email.com	$argon2id$v=19$m=65536,t=3,p=4$jfmX6xWr8SxHdVWXQnX2SA$2AqY3O5PVdQQw/rrI4gkggPtCxj+dfi/qqxX4+o00UA
35	User 35	user35@email.com	$argon2id$v=19$m=65536,t=3,p=4$H1VlHP1HJFHBlgMCwedSAw$5Pre+S0Pdzg/0oIkCUI2Sv2P/KOen2yQIgd/UIGWXi4
36	User 36	user36@email.com	$argon2id$v=19$m=65536,t=3,p=4$7KhvIy4Xuqmd/A5xGLTB6g$DUutlkJLEiVBv1o6hKN00uY180Sf3Jes84kv5HfhNnE
37	User 37	user37@email.com	$argon2id$v=19$m=65536,t=3,p=4$md+7HBtjJxjc7ybKLJjtqA$Kl6DfmsXtq+AKsJBuB8EJGiDlOThyEW+UwwKIdChklA
38	User 38	user38@email.com	$argon2id$v=19$m=65536,t=3,p=4$X7BOctBZ0QPg3eAY12P5uA$eG7hcu1jRttiyBPRbFVVAwq8UTrW7HYtK9C5OsbgHtc
39	User 39	user39@email.com	$argon2id$v=19$m=65536,t=3,p=4$LYub+gzLaVqixGe+Ib4qzA$v8vsxCDu5X3EOKP1iWz5jRQ3TnkT1tpjizJrV/JNTa0
40	User 40	user40@email.com	$argon2id$v=19$m=65536,t=3,p=4$jB6wo5HA3TexZ1aEWIS+cw$/wXGbZg7a3Ott34IDkECSB5bz4Atz2GJc3MB/HzMfZY
41	User 41	user41@email.com	$argon2id$v=19$m=65536,t=3,p=4$lQ+SBkfw6gwRE5wX0tnhzA$DvmGTlNVQ627lfSiOz5cw+k8XxHotAL0txsbtpsDbg8
42	User 42	user42@email.com	$argon2id$v=19$m=65536,t=3,p=4$Rxi32w/DLA/mFJ7TQlkmNg$kar+MZQ4WINmB03D+PMGFs1NQUnF0xOm+ZXONF6Wjjw
43	User 43	user43@email.com	$argon2id$v=19$m=65536,t=3,p=4$pLvJ3BCDLFwthwgwyWU+kA$fnC8irzzYqqMrTOREej9pBRync4ovFwGQO3avUl/LpU
44	User 44	user44@email.com	$argon2id$v=19$m=65536,t=3,p=4$i7TbAQ3XZAfEtdv/pLz7mg$fR4487sT1sIFXihB/aA2dd8hqRbFiycWoBWufzvz72M
45	User 45	user45@email.com	$argon2id$v=19$m=65536,t=3,p=4$5t2y/ZHVNGPsasJPjN7+lg$rQsvm5YiK91hZdhWX4ndkRv+bOJ0UBOTYTMhl/XMVuk
46	User 46	user46@email.com	$argon2id$v=19$m=65536,t=3,p=4$Kaaq8/RAztA5uqd/G8LqNg$WhlNImfBqPOEc2CPh0Z01d1UQsvonJ5PSB7vk+dAnpI
47	User 47	user47@email.com	$argon2id$v=19$m=65536,t=3,p=4$PShjLTmkSW7/EBLCKErprg$tiNSlpP/Lg9lp27hI8NeJWeoPN42sCNHd82Z/9F2NPo
48	User 48	user48@email.com	$argon2id$v=19$m=65536,t=3,p=4$XlcB9R+wKiRH6MC3aCWiZw$LE2IT+z0OSdy7iaHXyTFIPQwBvQVrVeRsKumwWX6gcc
49	User 49	user49@email.com	$argon2id$v=19$m=65536,t=3,p=4$NCvhuegajH1nUQloATvDiQ$NF6t41Xr1DUB89kiGO0MfJ6BO2L1b4k/SxkHTSazKtE
50	User 50	user50@email.com	$argon2id$v=19$m=65536,t=3,p=4$oehKMGGjgH7snteM/N4zqg$oYnP9s7T21JE46jpuDK1AtGJ1alX9PbQ9/Zx/m5BbRM
51	tuser	temail	$argon2id$v=19$m=65536,t=3,p=4$tr4yxr28V7raci2Lpuwk2g$QiQxIJKPmbKQizQFdtPgG/pHU+yS2HZrqQpyKEOONTY
\.


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: xavier
--

SELECT pg_catalog.setval('public.users_userid_seq', 51, true);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (appointmentid);


--
-- Name: bloodunits bloodunits_pkey; Type: CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.bloodunits
    ADD CONSTRAINT bloodunits_pkey PRIMARY KEY (unitid);


--
-- Name: donors donors_pkey; Type: CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.donors
    ADD CONSTRAINT donors_pkey PRIMARY KEY (userid);


--
-- Name: hospitalstaff hospitalstaff_pkey; Type: CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.hospitalstaff
    ADD CONSTRAINT hospitalstaff_pkey PRIMARY KEY (userid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: one_appt_at_a_time; Type: INDEX; Schema: public; Owner: xavier
--

CREATE UNIQUE INDEX one_appt_at_a_time ON public.appointments USING btree (donorid) WHERE (status = 'ongoing'::public.aptstatus);


--
-- Name: appointments appointments_donorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_donorid_fkey FOREIGN KEY (donorid) REFERENCES public.donors(userid);


--
-- Name: appointments appointments_staffid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_staffid_fkey FOREIGN KEY (staffid) REFERENCES public.hospitalstaff(userid);


--
-- Name: bloodunits bloodunits_appointmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.bloodunits
    ADD CONSTRAINT bloodunits_appointmentid_fkey FOREIGN KEY (appointmentid) REFERENCES public.appointments(appointmentid);


--
-- Name: donors donors_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.donors
    ADD CONSTRAINT donors_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- Name: hospitalstaff hospitalstaff_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xavier
--

ALTER TABLE ONLY public.hospitalstaff
    ADD CONSTRAINT hospitalstaff_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict kJ7ti6GtYkJenRXdtMTdxqrJEQYWqrfC7ddhFogn0myIWLlmq1tlS168FsAVLX5

